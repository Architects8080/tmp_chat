import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelListDto } from './dto/channel-list.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel, ChannelMember } from './entity/channel.entity';

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
}
