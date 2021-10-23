import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DmModule } from 'src/dm/dm.module';
import { DirectMessageInfo } from 'src/dm/entity/dm.entity';
import { FriendModule } from 'src/friend/friend.module';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { CommunityEventModule } from './event/community-event.module';
import { CommunityGateway } from './community.gateway';
import { StatusModule } from './status/status.module';
import { CommunitySocketUserModule } from './socket-user/community.socket-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DirectMessageInfo]),
    AuthModule,
    DmModule,
    UserModule,
    StatusModule,
    CommunityEventModule,
    CommunitySocketUserModule,
    FriendModule,
  ],
  providers: [CommunityGateway],
  exports: [CommunityGateway],
})
export class CommunityModule {}
