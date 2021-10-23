import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementService } from 'src/achievement/achievement.service';
import { AchievementId } from 'src/achievement/achievement.type';
import { MatchPlayer } from 'src/match/entity/match-player.entity';
import { Match } from 'src/match/entity/match.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchPlayer)
    private matchPlayerRepository: Repository<MatchPlayer>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private achievementService: AchievementService,
  ) {}

  async getMatchByUser(userId: number) {
    const matchPlayers = await this.matchPlayerRepository.find({
      where: {
        userId: userId,
      },
    });

    const matchIds = matchPlayers.map((mp) => {
      return mp.matchId;
    });

    await this.updateAchievement(userId);
    return this.matchRepository.find({
      order: {
        endAt: 'DESC',
      },
      where: {
        id: In(matchIds),
      },
      relations: ['players', 'players.user'],
    });
  }

  async updateAchievement(userId: number) {
    const userMatchInfo = await this.matchPlayerRepository.findAndCount({
      where: {
        userId: userId,
      }
    });

    const matchList = userMatchInfo[0];
    const matchCount = userMatchInfo[1];

    if (matchCount >= 10) //TEST : 1
      await this.achievementService.updateAchievementInfo(userId, AchievementId.PLAY_10_GAMES);
    if (matchCount >= 20) //TEST : 3
      await this.achievementService.updateAchievementInfo(userId, AchievementId.PLAY_20_GAMES);

    const winCount = matchList.filter((match) => {
      return match.userId == userId && match.isWinner;
    }).length;

    if (winCount >= 10) //TEST : 1
      await this.achievementService.updateAchievementInfo(userId, AchievementId.WIN_10_TIMES);
    if (winCount >= 20) //TEST : 3
      await this.achievementService.updateAchievementInfo(userId, AchievementId.WIN_20_TIMES);
  }
}
