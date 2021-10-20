import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChannelRoleService } from './channel-role.service';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';
import { ChannelSocketUserService } from './channel.socket-user.service';
import { ChannelMember } from './entity/channel-member.entity';
import { ChannelMessage } from './entity/channel-message.entity';
import { ChannelPenalty } from './entity/channel-penalty.entity';
import { Channel } from './entity/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ChannelMember,
      ChannelPenalty,
      ChannelMessage,
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    ChannelGateway,
    ChannelSocketUserService,
    ChannelRoleService,
  ],
})
export class ChannelModule {}
