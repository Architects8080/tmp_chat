import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { SocketUserService } from './socket-user.service';

@Module({
  imports: [AuthModule],
  providers: [GameGateway, GameService, GameRepository, SocketUserService],
  exports: [GameService, SocketUserService, GameRepository],
})
export class GameModule {}
