export interface WaitingUser {
  userId: number;
  waitingAt: Date;
  ladderPoint: number;
  // 매칭이 되어 방이 있는 경우
  hasRoom: boolean;
}
