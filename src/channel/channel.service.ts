import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { cookieExtractor, JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { Repository } from 'typeorm';
import { ChannelListDto } from './dto/channel-list.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, ChannelMember } from './entity/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
  ) {}

  channelMap: Map<number, ChannelListDto> = new Map();

  async onModuleInit() {
    await this.getAllChannelDB();
  }

  async getAllChannelDB() {
    const channels: Channel[] = await this.channelRepository.find();
    if (!channels) return;
    for (const channel of channels) {
      const instance = new ChannelListDto();
      instance.roomId = channel.id;
      instance.title = channel.title;
      instance.isProtected =
        channel.type === 2 ? 2 : channel.type === 1 ? 1 : 0;
      const memCnt = await this.channelMemberRepository.findAndCount({
        where: {
          channelID: channel.id,
        },
        join: {
          alias: 'channel_member',
          leftJoinAndSelect: {
            channel: 'channel_member.channel',
          },
        },
      });
      instance.memberCount = memCnt[1];
      this.channelMap.set(instance.roomId, instance);
    }
  }

  async getAllChannel() {
    this.channelMap.clear();
    await this.getAllChannelDB();
    return [...this.channelMap.values()];
  }

  async getMyChannel(req) {
    const token = cookieExtractor(req); //error
    const userPayload = this.jwtService.verify(token);
    const user = await this.jwtStrategy.validate(userPayload);
    const myChannel = [];
    const channels = await this.channelMemberRepository.find({
      select: ['channel'],
      where: {
        userID: user.id,
      },
      join: {
        alias: 'channel_member',
        leftJoinAndSelect: {
          channel: 'channel_member.channel',
        },
      },
    });
    for (const channel of channels) {
      const instance = new ChannelListDto();
      instance.roomId = channel.channelID;
      instance.title = channel.channel.title;
      instance.isProtected =
        channel.channel.type === 2 ? 2 : channel.channel.type === 1 ? 1 : 0;
      const memCnt = await this.channelMemberRepository.findAndCount({
        where: {
          channelID: channel.channelID,
        },
        join: {
          alias: 'channel_member',
          leftJoinAndSelect: {
            channel: 'channel_member.channel',
          },
        },
      });
      instance.memberCount = memCnt[1];
      myChannel.push(instance);
    }
    return myChannel;
  }

  async createChannel(channelData: CreateChannelDto) {
    const newChannel: Channel = this.channelRepository.create({
      title: channelData.title,
      type: channelData.type,
      password: channelData.password,
    });
    await this.channelRepository.insert(newChannel);
    const newChannelMember: ChannelMember =
      this.channelMemberRepository.create();
    newChannelMember.userID = channelData.ownerId;
    const tmpChannelId = await this.channelRepository.find({
      select: ['id'],
      order: {
        id: 'DESC',
      },
      take: 1,
    });
    newChannelMember.channelID = tmpChannelId[0].id;
    newChannelMember.permissionType = 2;
    newChannelMember.penalty = 0;
    await this.channelMemberRepository.insert(newChannelMember);
    return tmpChannelId[0].id;
  }

  async joinChannel(roomId: number, userId: number) {
    const newChannelMember: ChannelMember =
      this.channelMemberRepository.create();
    newChannelMember.userID = userId;
    newChannelMember.channelID = roomId;
    newChannelMember.permissionType = 0;
    newChannelMember.penalty = 0;
    await this.channelMemberRepository.insert(newChannelMember);
  }
}
