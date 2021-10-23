import { Inject, Injectable } from '@nestjs/common';
import { serialize } from 'class-transformer';
import { Notification } from 'src/notification/entity/notification.entity';
import { Server } from 'socket.io';
import { SocketUserService } from 'src/socket/socket-user.service';
import { UserService } from 'src/user/user.service';
import { mergeUserAndStatus } from '../data/status-user';
import { COMMUNITY_SOCKET_USER_SERVICE_PROVIDER } from '../socket-user/community.socket-user.service';
import { StatusService } from '../status/status.service';

@Injectable()
export class CommunityEventService {
  constructor(
    @Inject(COMMUNITY_SOCKET_USER_SERVICE_PROVIDER)
    private socketUserService: SocketUserService,
    private statusService: StatusService,
    private userService: UserService,
  ) {}

  server: Server;

  async notify(receiverId: number, notification: Notification) {
    const client = this.socketUserService.getSocketById(receiverId);
    if (!client) return;
    client.emit('notificationReceive', notification);
  }

  async addFriendUser(receiverId: number, friendId: number) {
    const client = this.socketUserService.getSocketById(receiverId);
    if (!client) return;
    try {
      const friend = await this.userService.getUserById(friendId);
      const friendStatus = this.statusService.getUserStatusById(friendId);
      client.emit(
        'addFriendUser',
        JSON.parse(serialize(mergeUserAndStatus(friend, friendStatus))),
      );
      client.join(`user:${friendId.toString()}`);
    } catch (error) {}
  }

  async removeFriendUser(receiverId: number, friendId: number) {
    const client = this.socketUserService.getSocketById(receiverId);
    if (!client) return;
    client.leave(`user:${friendId.toString()}`);
    client.emit('removeFriendUser', friendId);
  }
}
