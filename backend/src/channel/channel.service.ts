import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelListDto } from './dto/channel-list.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, ChannelMember } from './entity/channel.entity';
import * as bcrypt from 'bcrypt';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
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

  async getMyChannel(userId: number) {
    const myChannel = [];
    const channels = await this.channelMemberRepository.find({
      select: ['channel'],
      where: {
        userID: userId,
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
    const myChannel = await this.getMyChannel(userId);
    if (myChannel.find((myChannel) => myChannel.roomId == roomId)) {
    } else {
      const newChannelMember: ChannelMember =
        this.channelMemberRepository.create();
      newChannelMember.userID = userId;
      newChannelMember.channelID = roomId;
      newChannelMember.permissionType = 0;
      newChannelMember.penalty = 0;
      await this.channelMemberRepository.insert(newChannelMember);
    }
  }

  async checkPassword(roomId: number, password: string) {
    try {
      const hashedpw = await this.channelRepository.findOne({
        where: {
          id: roomId,
        },
      });
      const isPasswordMatching = await bcrypt.compare(
        password,
        hashedpw.password,
      );
      return isPasswordMatching ? true : false;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async leaveChannel(roomId: number, userId: number) {
    await this.channelMemberRepository.delete({
      userID: userId,
      channelID: roomId,
    });
    const memCnt = await this.channelMemberRepository.count({
      where: {
        channelID: roomId,
      },
    });
    if (memCnt === 0) await this.channelRepository.delete({ id: roomId });
  }

  async updateChannel(roomId: number, updateData: UpdateChannelDto) {
    const updateChannel = await this.channelRepository.findOne(roomId);
    console.log(updateChannel);
    for (const key in updateData) {
      updateChannel[key] = updateData[key];
    }
    await this.channelRepository.save(updateChannel);
  }

  async getChannelMember(roomId: number) {
    const member = await this.channelMemberRepository.find({
      select: ['user'],
      where: {
        channelID: roomId,
      },
      join: {
        alias: 'channel_member',
        leftJoinAndSelect: {
          user: 'channel_member.user',
        },
      },
    });
    const obj = member.map(({ userID, ...keepAttrs }) => keepAttrs);
    const result = [];
    obj.map((item) => {
      result.push({
        id: item['user'].id,
        avatar: item['user'].avatar,
        status: item['user'].status,
        nickname: item['user'].nickname,
      });
    });
    return result;
  }
}
