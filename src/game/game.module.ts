import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { GameSocketUserService } from './game.socket-user.service';

@Module({
  imports: [AuthModule],
  providers: [GameGateway, GameService, GameRepository, GameSocketUserService],
  exports: [GameService, GameSocketUserService, GameRepository],
})
export class GameModule {}
