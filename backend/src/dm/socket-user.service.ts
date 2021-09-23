import { Injectable } from '@nestjs/common';
import { SocketUser } from 'src/socket/socket-user';

@Injectable()
export class SocketUserService {
  private socketUser: Map<number, SocketUser> = new Map();

  getSocketById(id: number): SocketUser {
    return this.socketUser.get(id);
  }

  addSocket(socket: SocketUser) {
    this.socketUser.set(socket.user.id, socket);
  }

  removeSocket(socket: SocketUser) {
    this.socketUser.delete(socket.user.id);
  }
}