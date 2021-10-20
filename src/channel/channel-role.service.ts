import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMember, MemberRole } from './entity/channel-member.entity';
import { Channel } from './entity/channel.entity';

@Injectable()
export class ChannelRoleService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
  ) {}

  // 해당 유저의 role 해당 room에서의 role 확인
  async getRole(channelId: number, userId: number) {
    const channelMember = await this.channelMemberRepository.findOne({
      select: ['role'],
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!channelMember) return MemberRole.MEMBER;
    return channelMember.role;
  }
}
