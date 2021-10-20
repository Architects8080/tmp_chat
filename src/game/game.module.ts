import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommunityModule } from 'src/community/community.module';
import { CommunitySocketUserModule } from 'src/community/socket-user/community.socket-user.module';
import { StatusService } from 'src/community/status/status.service';
import { UserModule } from 'src/user/user.module';
import { MatchPlayer } from '../match/entity/match-player.entity';
import { Match } from '../match/entity/match.entity';
import { GameRoomService } from './game-room.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { GameSocketUserService } from './game.socket-user.service';
import { MatchmakerService } from './matchmaker/matchmaker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, MatchPlayer]),
    AuthModule,
    UserModule,
    CommunitySocketUserModule,
  ],
  providers: [
    GameGateway,
    GameService,
    GameRoomService,
    GameRepository,
    MatchmakerService,
    GameSocketUserService,
    StatusService,
  ],
  controllers: [GameController],
  exports: [GameService, GameSocketUserService, GameRepository],
})
export class GameModule {}
