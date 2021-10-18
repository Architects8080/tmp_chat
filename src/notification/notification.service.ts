import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityGateway } from 'src/community/community.gateway';
import { FriendService } from 'src/friend/friend.service';
import { Repository } from 'typeorm';
import { NotificationDto } from './dto/notification';
import { Notification, NotificationType } from './entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,
    @Inject(forwardRef(() => CommunityGateway))
    private readonly communityGateway: CommunityGateway,
  ) {}

  async getNotifications(userId: number) {
    return await this.notificationRepository.find({ receiverId: userId });
  }

  async getNotificationById(notiId: number) {
    const result = await this.notificationRepository.findOne({
      id: notiId,
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async setNotification(userId: number, dto: NotificationDto) {
    const notification = this.notificationRepository.create({
      senderId: userId,
      ...dto,
    });
    const result = await this.notificationRepository.findOne(notification);

    if (result) return null;
    try {
      const insertResult = await this.notificationRepository.insert(
        notification,
      );
      this.communityGateway.notify(dto.receiverId, notification);
      return insertResult;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async deleteNotification(notification: NotificationDto) {
    return await this.notificationRepository.delete(notification);
  }

  async acceptNotification(userId: number, notiId: number) {
    const noti: Notification = await this.getNotificationById(notiId);
    if (noti.receiverId != userId) throw new ForbiddenException();
    await this.notificationRepository.delete(notiId);
    switch (noti.type) {
      case NotificationType.FRIEND: {
        return this.friendService.setFriend({
          userId: noti.senderId,
          otherId: noti.targetId,
        });
      }
      case NotificationType.CHANNEL: {
      }
    }
  }

  async refuseNotification(userId: number, notiId: number) {
    const noti: Notification = await this.getNotificationById(notiId);
    if (!noti) throw new NotFoundException();
    if (noti.receiverId != userId) throw new ForbiddenException();
    await this.notificationRepository.delete(notiId);
  }
}
