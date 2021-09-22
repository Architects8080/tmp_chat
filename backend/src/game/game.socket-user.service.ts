import { Scope } from '@nestjs/common';
import { SocketUserService } from 'src/socket/socket-user.service';

export const GameSocketUserService = {
  provide: 'GAME_SOCKET_USER_SERVICE',
  useClass: SocketUserService,
  scope: Scope.DEFAULT,
};
