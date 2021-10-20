import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementModule } from 'src/achievement/achievement.module';
import { MatchPlayer } from 'src/match/entity/match-player.entity';
import { Match } from 'src/match/entity/match.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchPlayer]), AchievementModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
