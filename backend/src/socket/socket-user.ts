import { Socket } from 'socket.io';
import { User } from 'src/user/entity/user.entity';

interface WrapperUser {
  user: User;
}

export interface SocketUser extends Socket, WrapperUser {}
