export type User = {
  id: number;
  nickname: string;
  intraLogin: string;
  avatar: string;
  status: number;
  ladderPoint: number;
  ladderLevel: number;
}

export type Match = {
  id: number;
  gameType: number;
  startAt: Date;
  endAt: Date;
  gameTime: number;
  players: MatchPlayer[];
  targetId: number;
}

export type MatchPlayer = {
  match: Match;
  matchId: number;
  user: User;
  userId: number;
  score: number;
  isLeft: boolean;
  isWinner: boolean;
  ladderPoint: number;
  ladderIncrease: number;
}

export type MatchRatio = {
  win: number;
  lose: number;
  total: number;
};

export type Achievement = {
  id: number,
  title: string,
}