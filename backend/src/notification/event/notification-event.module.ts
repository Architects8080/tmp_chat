import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityEventModule } from 'src/community/event/community-event.module';
import { UserModule } from 'src/user/user.module';
import { Notification } from '../entity/notification.entity';
import { NotificationEventService } from './notification-event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    CommunityEventModule,
    UserModule,
  ],
  providers: [NotificationEventService],
  exports: [NotificationEventService],
})
export class NotificationEventModule {}
