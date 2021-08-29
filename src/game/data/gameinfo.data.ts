// 실제 게임 속 데이터가 들어간다. (position 등)
// game object ...

import { GamePlayer } from './game-player.data';
import { Position } from './position.data';

export class GameInfo {
  player1: GamePlayer;
  player2: GamePlayer;
  ball: Position;
  obstacles: Position[];
}
