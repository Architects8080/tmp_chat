import { GamePlayer } from './game-player.data';
import { GameObject } from './object.data';

export class GameInfo {
  player1: GamePlayer = new GamePlayer();
  player2: GamePlayer = new GamePlayer();
  ball: GameObject = new GameObject();
  mapImage: string;
  obstacles: GameObject[] = [];
  startAt: Date = new Date();
  endAt: Date;
}
