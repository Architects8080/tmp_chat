import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel, ChannelMember } from './entity/channel.entity';
import { ChannelGateway } from './channel.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChannelSocketUserService } from './channel.socket-user.service';
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChannelRoleService } from './channel-role.service';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';
import { ChannelSocketUserService } from './channel.socket-user.service';
import { Channel, ChannelMember } from './entity/channel.entity';
>>>>>>> a864136ce98e1c940db1ee791c31ad90ab99a749

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMember]),
    AuthModule,
    UserModule,
  ],
<<<<<<< HEAD
  providers: [ChannelService, ChannelGateway, ChannelSocketUserService],
  controllers: [ChannelController],
=======
  controllers: [ChannelController],
  providers: [
    ChannelService,
    ChannelGateway,
    ChannelSocketUserService,
    ChannelRoleService,
  ],
>>>>>>> a864136ce98e1c940db1ee791c31ad90ab99a749
})
export class ChannelModule {}
