import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { DirectMessage, DirectMessageInfo } from './entity/dm.entity';
import { DmGateway } from './dm.gateway';
import { SocketUserService } from './socket-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectMessage, DirectMessageInfo]), AuthModule],
  controllers: [DmController],
  providers: [DmService, DmGateway, SocketUserService]
})
export class DmModule {}
