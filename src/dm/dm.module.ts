import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { DirectMessage, DirectMessageInfo } from './entity/dm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DirectMessage, DirectMessageInfo]), AuthModule],
  controllers: [DmController],
  providers: [DmService],
  exports: [DmService]
})
export class DmModule {}
