// socket room 관련 repository에서는 이 클래스를 관리한다.
// socket room + gameinfo + game entity

import { GameInfo } from './gameinfo.data';
import { RoomPlayer } from './room-player.data';

export class GameRoom {
  socketRoomId: number; // 실제 socketRoom이름으로 쓰이게 한다.
  subscriberList: string[];

  gameInfo: GameInfo | null | undefined;

  gameStatus;

  player1: RoomPlayer;
  player2: RoomPlayer;

  gameType: number; // need change to enum

  interval; // need when call clearInteravl
}
