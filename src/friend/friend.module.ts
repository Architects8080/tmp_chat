import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from 'src/block/entity/block.entity';
import { CommunityEventModule } from 'src/community/event/community-event.module';
import { StatusModule } from 'src/community/status/status.module';
import { NotificationEventModule } from 'src/notification/event/notification-event.module';
import { UserModule } from 'src/user/user.module';
import { Friend } from './entity/friend.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, Block]),
    NotificationEventModule,
    UserModule,
    CommunityEventModule,
    StatusModule,
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
