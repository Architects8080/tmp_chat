import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GamePlayer } from './data/game-player.data';
import { GameStatus } from './data/game-status.data';
import { GameRoom } from './data/gameroom.data';
import { MatchPlayer } from '../match/entity/match-player.entity';
import { Match } from '../match/entity/match.entity';

@Injectable()
export class GameRepository {
  // need typeorm
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(MatchPlayer)
    private matchPlayerRepository: Repository<MatchPlayer>,
    private userService: UserService,
  ) {}

  gameRoomMap: Map<number, GameRoom> = new Map();

  private generateRoomId(): number {
    let id = 0;
    while (id == 0 || this.gameRoomMap.has(id)) {
      const max = 1000;
      const min = 100;
      id = Math.floor(Math.random() * (max - min)) + min;
    }
    return id;
  }

  getGameRoom(roomId: number): GameRoom {
    return this.gameRoomMap.get(roomId);
  }

  createGameRoom(): GameRoom {
    const instance = new GameRoom();
    const socketRoomId = this.generateRoomId();

    instance.socketRoomId = socketRoomId;
    instance.gameStatus = GameStatus.READY;
    this.gameRoomMap.set(socketRoomId, instance);
    return instance;
  }

  deleteGameRoom(roomId: number) {
    return this.gameRoomMap.delete(roomId);
  }

  updateGameRoom(roomId: number, gameRoom: GameRoom) {
    return this.gameRoomMap.set(roomId, gameRoom);
  }

  async saveMatchPlayer(
    matchId: number,
    player: GamePlayer,
    isLeft: boolean,
    isWinner: boolean,
  ) {
    const matchPlayer = this.matchPlayerRepository.create();
    const user = await this.userService.getUserById(player.id);
    matchPlayer.matchId = matchId;
    matchPlayer.userId = player.id;
    matchPlayer.score = player.score;
    matchPlayer.isLeft = isLeft;
    matchPlayer.ladderPoint = user.ladderPoint;
    matchPlayer.ladderIncrease = 0; // TODO
    matchPlayer.isWinner = isWinner;
    this.matchPlayerRepository.insert(matchPlayer);
  }

  async saveGameToDB(roomId: number) {
    const room = this.getGameRoom(roomId);
    if (!room) return null;
    const gameInfo = room.gameInfo;
    const match: Match = this.matchRepository.create();
    const gameTime =
      (gameInfo.endAt.getTime() - gameInfo.startAt.getTime()) / 1000;
    const isPlayer1Win = gameInfo.player1.score > gameInfo.player2.score;
    match.startAt = gameInfo.startAt;
    match.endAt = gameInfo.endAt;
    match.gameTime = Math.round(gameTime); // second
    match.gameType = room.gameType;
    await this.matchRepository.insert(match);
    this.saveMatchPlayer(match.id, gameInfo.player1, true, isPlayer1Win);
    this.saveMatchPlayer(match.id, gameInfo.player2, false, !isPlayer1Win);
  }
}
