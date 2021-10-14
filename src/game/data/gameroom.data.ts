import { GameStatus } from './game-status.data';
import { GameType } from './game-type.data';
import { GameInfo } from './gameinfo.data';
import { RoomPlayer } from './room-player.data';

export class GameRoom {
  socketRoomId: number; // 실제 socketRoom이름으로 쓰이게 한다.
  subscriberList: string[];

  gameInfo: GameInfo | null | undefined;

  gameStatus: GameStatus;

  player1: RoomPlayer;
  player2: RoomPlayer;

  gameType: GameType;
  mapType: number; // map index(id)

  isObstacle: boolean;
  interval: NodeJS.Timer;
}
