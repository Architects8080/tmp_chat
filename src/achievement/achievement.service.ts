import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Achievement } from './entity/achievement.entity';
import { UserAchievement } from './entity/user-achievement.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
  ) {
    const achievementTitle = ['10회 승리', '20회 승리', '10회 이상 플레이', '20회 이상 플레이', 'OTP 등록'];

    achievementTitle.map((title, index) => {
      const achievement = achievementRepository.create();
      achievement.id = index + 1;
      achievement.title = title;
      achievementRepository.save(achievement);
    })
  }

  async getAchievementByUser(userId: number) {
    const achievementList = await this.userAchievementRepository.find({
      where: {
        userId: userId,
      },
      relations: ['achievement'],
    });

    return achievementList.map((achievement) => {
      return achievement.achievement;
    })
  }

  async updateAchievementInfo(userId: number, achievementId: number) {
    const userAchievement = this.userAchievementRepository.create({
      userId: userId,
      achievementId: achievementId,
    });

    try {
      await this.userAchievementRepository.save(userAchievement);
    } catch (error) {}
  }
}
