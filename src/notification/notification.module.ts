import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { CommunityEventModule } from 'src/community/event/community-event.module';
import { FriendModule } from 'src/friend/friend.module';
import { UserModule } from 'src/user/user.module';
import { Notification } from './entity/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    FriendModule,
    CommunityEventModule,
    ChannelModule,
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
