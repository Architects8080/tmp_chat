export type Position = {
  x: number;
  y: number;
};

export type GamePlayer = {
  id: number;
  score: number;
  position: Position;
};

export type GameInfo = {
  player1: GamePlayer;
  player2: GamePlayer;
  ball: Position;
  obstacles: Position[];
};
