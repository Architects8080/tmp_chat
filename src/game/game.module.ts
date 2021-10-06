import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MatchPlayer } from '../match/entity/match-player.entity';
import { Match } from '../match/entity/match.entity';
import { GameRoomService } from './game-room.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { GameSocketUserService } from './game.socket-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, MatchPlayer]),
    AuthModule,
    UserModule,
  ],
  providers: [
    GameGateway,
    GameService,
    GameRoomService,
    GameRepository,
    GameSocketUserService,
  ],
  controllers: [GameController],
  exports: [GameService, GameSocketUserService, GameRepository],
})
export class GameModule {}
