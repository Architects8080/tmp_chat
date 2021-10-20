import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SocketUserService } from 'src/socket/socket-user.service';
import { CommunityGateway } from './community.gateway';
import { COMMUNITY_SOCKET_USER_SERVICE_PROVIDER } from './community.socket-user.service';
import { UserStatus } from './data/user-status';

@Injectable()
export class StatusService {
  constructor(
    @Inject(forwardRef(() => CommunityGateway))
    private communityGateway: CommunityGateway,
    @Inject(COMMUNITY_SOCKET_USER_SERVICE_PROVIDER)
    private communitySocketUserService: SocketUserService,
  ) {}

  userMap: Map<number, UserStatus> = new Map();

  getUserStatusById(id: number): UserStatus {
    const status = this.userMap.get(id);
    if (status !== undefined) return status;
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
    if (this.getUserStatusById(id) != updateStatus)
      this.communityGateway.server
        .to(`user:${id.toString()}`)
        .emit('chagneUserStatus', id, updateStatus);
    this.userMap.set(id, status);
  }
}
