import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entity/achievement.entity';
import { UserAchievement } from './entity/user-achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement])],
  providers: [AchievementService],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
