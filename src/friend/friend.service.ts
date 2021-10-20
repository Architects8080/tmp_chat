import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from 'src/block/entity/block.entity';
import { mergeUserAndStatus, StatusUser } from 'src/community/data/status-user';
import { CommunityEventService } from 'src/community/event/community-event.service';
import { StatusService } from 'src/community/status/status.service';
import { Friend } from 'src/friend/entity/friend.entity';
import { NotificationType } from 'src/notification/entity/notification.entity';
import { NotificationEventService } from 'src/notification/event/notification-event.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RequestFriendResult } from './data/request-friend.result';
import { FriendRelationshipDto } from './dto/friend-relationship.dto';
import { FriendException } from './friend.exception';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private notificationEventService: NotificationEventService,
    private userService: UserService,
    private communityEventService: CommunityEventService,
    private statusService: StatusService,
  ) {}

  async deleteFriend(dto: FriendRelationshipDto) {
    await this.friendRepository.delete(dto);
    await this.friendRepository.delete({
      userId: dto.otherId,
      otherId: dto.userId,
    });
    this.communityEventService.removeFriendUser(dto.otherId, dto.userId);
    this.communityEventService.removeFriendUser(dto.userId, dto.otherId);
  }

  async setFriend(dto: FriendRelationshipDto) {
    if (dto.otherId == dto.userId) throw new BadRequestException();
    try {
      await this.friendRepository.insert(this.friendRepository.create(dto));
      await this.friendRepository.insert(
        this.friendRepository.create({
          userId: dto.otherId,
          otherId: dto.userId,
        }),
      );
      this.communityEventService.addFriendUser(dto.userId, dto.otherId);
      this.communityEventService.addFriendUser(dto.otherId, dto.userId);
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new ConflictException();
        case '23503':
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }
  }

  async getFriendList(userId: number) {
    const blockList = this.blockRepository
      .createQueryBuilder('block')
      .select('block.otherId')
      .where('block.userId = :userId', { userId: userId });

    const friendList = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.userId = :userId', { userId: userId })
      .andWhere(`friend.otherId NOT IN (${blockList.getSql()})`)
      .leftJoinAndSelect('friend.other', 'other')
      .orderBy('other.nickname', 'ASC')
      .getMany();
    return friendList.map((friend) => {
      return mergeUserAndStatus(
        friend.other,
        this.statusService.getUserStatusById(friend.otherId),
      );
    });
  }

  async getFriendById(dto: FriendRelationshipDto) {
    const result = await this.friendRepository.findOne({
      relations: ['other'],
      where: { userId: dto.userId, otherId: dto.otherId },
    });
    if (!result) throw new NotFoundException();
    return mergeUserAndStatus(
      result.other,
      this.statusService.getUserStatusById(result.otherId),
    );
  }

  throwRequestFriendError(result: RequestFriendResult) {
    throw new FriendException(result);
  }

  async requestFriend(dto: FriendRelationshipDto) {
    if (dto.otherId == dto.userId)
      return this.throwRequestFriendError(RequestFriendResult.Myself);
    try {
      const friend = await this.getFriendById(dto);
      if (friend)
        return this.throwRequestFriendError(RequestFriendResult.Already);
    } catch (error) {
      if (error instanceof FriendException) throw error;
    }
    try {
      await this.userService.getUserById(dto.otherId);
    } catch (error) {
      return this.throwRequestFriendError(RequestFriendResult.NotFoundUser);
    }
    try {
      const block = await this.blockRepository.findOne(dto);
      if (block) return this.throwRequestFriendError(RequestFriendResult.Block);
    } catch (error) {
      if (error instanceof FriendException) throw error;
    }
    try {
      const result = await this.notificationEventService.setNotification(
        dto.userId,
        {
          receiverId: dto.otherId,
          targetId: dto.otherId,
          type: NotificationType.FRIEND,
        },
      );
      if (!result)
        return this.throwRequestFriendError(RequestFriendResult.InProgress);
    } catch (error) {
      throw error;
    }
  }
}
