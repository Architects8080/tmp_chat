import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityEventService } from 'src/community/event/community-event.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { NotificationDto } from '../dto/notification';
import { Notification } from '../entity/notification.entity';

@Injectable()
export class NotificationEventService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly communityEventService: CommunityEventService,
    private readonly userService: UserService,
  ) {}

  async setNotification(userId: number, dto: NotificationDto) {
    const notification = this.notificationRepository.create({
      senderId: userId,
      ...dto,
      sender: await this.userService.getUserById(userId),
    });
    const result = await this.notificationRepository.findOne(notification);

    if (result) return null;
    try {
      const insertResult = await this.notificationRepository.insert(
        notification,
      );
      this.communityEventService.notify(dto.receiverId, notification);
      return insertResult;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
