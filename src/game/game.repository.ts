import { Injectable } from '@nestjs/common';
import { GameRoom } from './data/gameroom.data';

@Injectable()
export class GameRepository {
  // need typeorm
  constructor() {}

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
    // save to db
  }
}
