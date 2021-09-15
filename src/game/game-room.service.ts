import { Injectable } from '@nestjs/common';
import { GameStatus } from './data/game-status.data';
import { GameRoom } from './data/gameroom.data';
import { GameRepository } from './game.repository';

@Injectable()
export class GameRoomService {
  constructor(private gameRepository: GameRepository) {}

  getJoinedRoom(id: number): string {
    let result: string;
    for (const iter of this.gameRepository.gameRoomMap) {
      const roomId = iter[0];
      const room = iter[1];
      if (
        (room.player1.id == id || room.player2.id == id) &&
        room.gameStatus == GameStatus.STARTED
      ) {
        result = roomId.toString();
        break;
      }
    }
    return result;
  }

  isPlayingRoom(roomId: number): boolean {
    const gameRoom = this.gameRepository.getGameRoom(roomId);

    if (gameRoom && gameRoom.gameStatus == GameStatus.STARTED) return true;
    else return false;
  }

  invite(userId: number, targetUserId: number, mapSetting: any): number {
    const gameRoom = this.gameRepository.createGameRoom();

    gameRoom.player1 = { id: userId, isAccept: true };
    gameRoom.player2 = { id: targetUserId, isAccept: false };
    gameRoom.isObstacle = mapSetting.isObstacle;
    gameRoom.mapType = mapSetting.mapId;
    if (gameRoom.mapType == 0) gameRoom.mapType = 1;
    return gameRoom.socketRoomId;
  }

  accept(userId: number, roomId: number) {
    const gameRoom = this.gameRepository.getGameRoom(roomId);
    if (!gameRoom) return;
    if (gameRoom.player1.id == userId) gameRoom.player1.isAccept = true;
    if (gameRoom.player2.id == userId) gameRoom.player2.isAccept = true;
    if (gameRoom.player1.isAccept && gameRoom.player2.isAccept) return gameRoom;
    return;
  }

  cancel(userId: number, roomId: number) {
    const gameRoom = this.gameRepository.getGameRoom(roomId);
    if (!gameRoom) return;
    let canceledPlayerId;
    if (gameRoom.player1.id == userId) canceledPlayerId = gameRoom.player2.id;
    else if (gameRoom.player2.id == userId)
      canceledPlayerId = gameRoom.player1.id;
    else return;
    this.gameRepository.deleteGameRoom(roomId);
    return canceledPlayerId;
  }
}
