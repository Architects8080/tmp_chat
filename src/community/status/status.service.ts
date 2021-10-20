import { Injectable } from '@nestjs/common';
import { UserStatus } from '../data/user-status';

@Injectable()
export class StatusService {
  constructor() {}

  userMap: Map<number, UserStatus> = new Map();
  listenerList: ((id: number, status: UserStatus) => void)[] = [];

  getUserStatusById(id: number): UserStatus {
    const status = this.userMap.get(id);
    if (status) return this.userMap.get(id);
    return UserStatus.OFFLINE;
  }

  setUserStatusById(id: number, status: UserStatus) {
    this.userMap.set(id, status);
    this.listenerList.forEach((l) => {
      l(id, status);
    });
  }

  addListener(listener: (id: number, status: UserStatus) => void) {
    this.listenerList.push(listener);
  }
}
