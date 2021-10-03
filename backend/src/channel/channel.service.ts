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
    const channels: Channel[] = await this.channelRepository.find();
    for (const channel of channels) {
      const instance = new ChannelListDto();
      instance.roomId = channel.id;
      instance.title = channel.title;
      instance.isProtected = channel.type === 2 ? true : false;
      const memCnt = await this.channelMemberRepository.findAndCount({
        where: {
          channelID: channel.id,
        },
        join: {
          alias: 'channel_member',
          leftJoinAndSelect: {
            channel: 'channel_member.channelID',
          },
        },
      });
      instance.memberCount = memCnt[1];
      this.channelMap.set(instance.roomId, instance);
    }
  }

  async createChannel(channelData: CreateChannelDto) {
    const newChannel: Channel = this.channelRepository.create({
      title: channelData.title,
      type: channelData.type,
      password: channelData.password,
    });
    await this.channelRepository.insert(newChannel);
  }

  getAllChannel() {
    return [...this.channelMap.values()];
  }

  async getMyChannel(req) {
    const token = cookieExtractor(req); //error
    const userPayload = this.jwtService.verify(token);
    const user = await this.jwtStrategy.validate(userPayload);
    const myChannel = [];
    const channels = await this.channelMemberRepository.find({
      select: ['channelID'],
      where: {
        userID: user.id,
      },
      join: {
        alias: 'channel_member',
        leftJoinAndSelect: {
          channel: 'channel_member.channelID',
        },
      },
    });
    for (const channel of channels) {
      const instance = new ChannelListDto();
      instance.roomId = channel.channelID.id;
      instance.title = channel.channelID.title;
      instance.isProtected = channel.channelID.type === 2 ? true : false;
      const memCnt = await this.channelMemberRepository.findAndCount({
        where: {
          channelID: channel.channelID.id,
        },
        join: {
          alias: 'channel_member',
          leftJoinAndSelect: {
            channel: 'channel_member.channelID',
          },
        },
      });
      instance.memberCount = memCnt[1];
      myChannel.push(instance);
    }
    return myChannel;
  }
}
