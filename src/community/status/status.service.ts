import { Inject, Injectable } from '@nestjs/common';
import { SocketUserService } from 'src/socket/socket-user.service';
import { UserStatus } from '../data/user-status';
import { COMMUNITY_SOCKET_USER_SERVICE_PROVIDER } from '../socket-user/community.socket-user.service';

@Injectable()
export class StatusService {
  constructor(
    @Inject(COMMUNITY_SOCKET_USER_SERVICE_PROVIDER)
    private communitySocketUserService: SocketUserService) {}

  userMap: Map<number, UserStatus> = new Map();
  listenerList: ((id: number, status: UserStatus) => void)[] = [];

  getUserStatusById(id: number): UserStatus {
    const status = this.userMap.get(id);
    if (status) return this.userMap.get(id);
    return UserStatus.OFFLINE;
  }

  setUserStatusById(id: number, status: UserStatus) {
    const isPlaying = this.getUserStatusById(id) == UserStatus.PLAYING;
    let updateStatus = status;
    if (isPlaying) {
      if (this.communitySocketUserService.getSocketById(id))
        updateStatus = UserStatus.ONLINE;
      else updateStatus = UserStatus.OFFLINE;
    }
    this.userMap.set(id, status);
    if (this.getUserStatusById(id) != updateStatus)
      this.listenerList.forEach((l) => {
        l(id, status);
      });
  }

  addListener(listener: (id: number, status: UserStatus) => void) {
    this.listenerList.push(listener);
  }
}
