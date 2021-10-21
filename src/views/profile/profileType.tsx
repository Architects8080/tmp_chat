export enum GameType {
  CUSTOM = 0,
  LADDER,
}

export enum GameTier {
  BRONZE = "Bronze",
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum",
  DIAMOND = "Diamond",
}

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
  gameType: GameType;
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
  tier: GameTier;
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