import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Match } from './entity/match.entity';
import { GameRoomService } from './game-room.service';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { GameSocketUserService } from './game.socket-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), AuthModule],
  providers: [
    GameGateway,
    GameService,
    GameRoomService,
    GameRepository,
    GameSocketUserService,
  ],
  exports: [GameService, GameSocketUserService, GameRepository],
})
export class GameModule {}
