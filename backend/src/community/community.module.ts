import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DmService } from 'src/dm/dm.service';
import { DirectMessageInfo } from 'src/dm/entity/dm.entity';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { CommunityController } from './community.controller';
import { CommunityGateway } from './community.gateway';
import { CommunityService } from './community.service';
import { Block, Friend } from './entity/community.entity';
import { Notification } from './entity/notification.entity';
import { SocketUserService } from './socket-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Friend,
    Block,
    User,
    DirectMessageInfo,
    Notification
  ]), AuthModule],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    CommunityGateway,
    SocketUserService,
    UserService,
    DmService
  ]
})
export class CommunityModule {}
