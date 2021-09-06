import { GamePlayer } from './game-player.data';
import { Position } from './position.data';

export class GameInfo {
  player1: GamePlayer;
  player2: GamePlayer;
  ball: Position;
  obstacles: Position[];
}
