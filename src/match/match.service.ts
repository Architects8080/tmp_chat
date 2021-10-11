import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
