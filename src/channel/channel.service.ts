import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { mergeChannelAndCount } from './data/count-channel.data';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelMember, MemberRole } from './entity/channel-member.entity';
import { ChannelPenalty } from './entity/channel-penalty.entity';
import { Channel, ChannelType } from './entity/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(ChannelPenalty)
    private channelPenaltyRepository: Repository<ChannelPenalty>,
  ) {}

  async channelToCountChannel(channel: Channel) {
    const count = await this.channelMemberRepository.count({
      where: {
        channelId: channel.id,
      },
    });
    return mergeChannelAndCount(channel, count);
  }

  async getChannelList() {
    const channelList = await this.channelRepository.find({
      where: {
        type: In([ChannelType.PUBLIC, ChannelType.PROTECTED]),
      },
    });
    return await Promise.all(
      channelList.map((ch) => {
        return this.channelToCountChannel(ch);
      }),
    );
  }

  async getChannelListByUser(userId: number) {
    const channelMemberList = await this.channelMemberRepository.find({
      select: ['channel'],
      relations: ['channel'],
      where: {
        userId: userId,
      },
    });
    return await Promise.all(
      channelMemberList.map((cm) => {
        return this.channelToCountChannel(cm.channel);
      }),
    );
  }

  async createChannel(userId: number, channelDto: CreateChannelDto) {
    const channelData = this.channelRepository.create(channelDto);
    if (channelDto.type != ChannelType.PROTECTED) channelData.password = null;
    const channelResult = await this.channelRepository.insert(channelData);
    const channelId: number = Number(channelResult.identifiers[0].id);

    await this.channelMemberRepository.insert({
      channelId: channelId,
      userId: userId,
      role: MemberRole.OWNER,
    });
    // if (channelDto.type != ChannelType.PRIVATE)
    // emit addChannelList
    return { channelId: channelId };
  }

  async deleteChannel(channelId: number) {
    await this.channelRepository.delete(channelId);
    // emit remove channel List
  }

  async updateChannel(channelId: number, dto: UpdateChannelDto) {
    const channel = await this.channelRepository.findOne(channelId);

    if (dto.type) {
      if (dto.type != ChannelType.PROTECTED) dto.password = null;
    } else {
      if (channel.type != ChannelType.PROTECTED) dto.password = null;
    }
    for (const key in dto) {
      channel[key] = dto[key];
    }
    await this.channelRepository.save(channel);
    // emit add channel List
    // emit update channel List
  }
}
