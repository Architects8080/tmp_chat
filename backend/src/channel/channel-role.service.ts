import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel, ChannelMember } from './entity/channel.entity';

@Injectable()
export class ChannelRoleService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
  ) {}

  // 해당 유저의 role 해당 room에서의 role 확인
  async getRole(roomId: number, userId: number) {
    const role = await this.channelMemberRepository.find({
      select: ['permissionType'],
      where: {
        channelID: roomId,
        userID: userId,
      },
    });
    console.log('mypermission:', role[0].permissionType);
    return role[0].permissionType;
  }
}
