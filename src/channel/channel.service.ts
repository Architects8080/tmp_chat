import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { mergeChannelAndCount } from './data/count-channel.data';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelMember, MemberRole } from './entity/channel-member.entity';
import { ChannelPenalty } from './entity/channel-penalty.entity';
import { Channel, ChannelType } from './entity/channel.entity';
import * as bcrypt from 'bcrypt';
import { NotificationEventService } from 'src/notification/event/notification-event.service';
import { NotificationType } from 'src/notification/entity/notification.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(ChannelPenalty)
    private channelPenaltyRepository: Repository<ChannelPenalty>,
    private notificationEventService: NotificationEventService,
    private userService: UserService,
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
    // TODO if (channelDto.type != ChannelType.PRIVATE)
    // emit addChannelList
    return { channelId: channelId };
  }

  async deleteChannel(channelId: number) {
    await this.channelRepository.delete(channelId);
    // TODO emit remove channel List
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
    // TODO emit add channel List
    // TODO emit update channel List
  }

  async isJoinChannel(memberId: number, channelId: number) {
    try {
      await this.channelMemberRepository.findOneOrFail({
        where: {
          userId: memberId,
          channelId: channelId,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getChannelMemberList(channelId: number) {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .where(`channel.id=${channelId}`)
      .leftJoinAndSelect('channel.memberList', 'memberList')
      .leftJoinAndSelect('memberList.user', 'user')
      .orderBy({
        'memberList.role': 'DESC',
        'user.nickname': 'ASC',
      })
      .getOne();
    // with status?
    return channel.memberList;
  }

  async acceptChannelInvitation(userId: number, channelId: number) {
    if (await this.isJoinChannel(userId, channelId))
      throw new ConflictException();
    // TODO check ban
    try {
      await this.channelMemberRepository.insert({
        userId: userId,
        channelId: channelId,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async joinChannel(userId: number, channelId: number, password?: string) {
    if (await this.isJoinChannel(userId, channelId))
      throw new ConflictException();
    // TODO check ban
    const channel = await this.channelRepository.findOne(channelId);
    if (!channel || channel.type == ChannelType.PRIVATE)
      throw new NotFoundException();
    if (channel.type == ChannelType.PROTECTED) {
      if (
        !password ||
        password.length != 4 ||
        !password.match('^[0-9]+$') ||
        channel.password != (await bcrypt.hash(password, 10))
      )
        throw new ForbiddenException();
    }
    try {
      await this.channelMemberRepository.insert({
        userId: userId,
        channelId: channelId,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async leaveChannel(userId: number, channelId: number) {
    const removeMember = await this.channelMemberRepository.findOneOrFail({
      userId: userId,
      channelId: channelId,
    });
    await this.channelMemberRepository.delete(removeMember);
    const channelMemberList = await this.getChannelMemberList(channelId);
    if (channelMemberList.length <= 0) {
      await this.deleteChannel(channelId);
      return;
    } else {
      if (removeMember.role == MemberRole.OWNER) {
        const newOwner: ChannelMember = channelMemberList[0];

        newOwner.role = MemberRole.OWNER;
        await this.channelMemberRepository.save(newOwner);
        // change onwer emit ?
      }
    }
    // TODO update ?
  }

  async inviteUser(senderId: any, channelId: number, receiverId: number) {
    if (senderId == receiverId)
      throw new BadRequestException('Cannot invite yourself.');
    if (!await this.userService.getUserById(receiverId)) 
      throw new NotFoundException('Not found user');
      console
    if (await this.isJoinChannel(receiverId, channelId))
      throw new ConflictException('Already channel member');
    const result = await this.notificationEventService.setNotification(senderId, {
      receiverId: receiverId,
      targetId: channelId,
      type: NotificationType.CHANNEL,
    });
    if (!result) 
      throw new ConflictException('Already invited');
  }
}
