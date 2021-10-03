import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel, ChannelMember } from './entity/channel.entity';
import { ChannelGateway } from './channel.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChannelSocketUserService } from './channel.socket-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMember]),
    AuthModule,
    UserModule,
  ],
  providers: [ChannelService, ChannelGateway, ChannelSocketUserService],
  controllers: [ChannelController],
})
export class ChannelModule {}
