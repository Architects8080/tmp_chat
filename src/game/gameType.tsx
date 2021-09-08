export type Position = {
  x: number;
  y: number;
};

export type Vector = {
  dx: number;
  dy: number;
};

export type GameObject = {
  position: Position;
  vector: Vector;
};

export type GamePlayer = GameObject & {
  id: number;
  score: number;
};

export type GameInfo = {
  player1: GamePlayer;
  player2: GamePlayer;
  ball: GameObject;
  obstacles: GameObject[];
};
