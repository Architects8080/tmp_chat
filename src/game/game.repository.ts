import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameStatus } from './data/game-status.data';
import { GameRoom } from './data/gameroom.data';
import { Match } from './entity/match.entity';

@Injectable()
export class GameRepository {
  // need typeorm
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
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

  saveGameToDB(roomId: number) {
    const room = this.getGameRoom(roomId);
    if (!room) return false;
    const gameInfo = room.gameInfo;
    const match: Match = this.matchRepository.create();
    if (gameInfo.player1.score >= gameInfo.player2.score) {
      match.winner = gameInfo.player1.id;
      match.loser = gameInfo.player2.id;
      match.winnerScore = gameInfo.player1.score;
      match.loserScore = gameInfo.player2.score;
    } else {
      match.winner = gameInfo.player2.id;
      match.loser = gameInfo.player1.id;
      match.winnerScore = gameInfo.player2.score;
      match.loserScore = gameInfo.player1.score;
    }
    match.gameType = room.gameType;
    this.matchRepository.insert(match);
  }
}
