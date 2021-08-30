import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { SocketUserService } from './socket-user.service';

@Module({
  providers: [GameGateway, GameService, GameRepository, SocketUserService],
  exports: [GameService, SocketUserService, GameRepository],
})
export class GameModule {}
