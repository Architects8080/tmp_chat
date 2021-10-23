import { Scope } from '@nestjs/common';
import { SocketUserService } from 'src/socket/socket-user.service';

export const CHANNEL_SOCKET_USER_SERVICE_PROVIDER =
  'CHANNEL_SOCKET_USER_SERVICE';

export const ChannelSocketUserService = {
  provide: CHANNEL_SOCKET_USER_SERVICE_PROVIDER,
  useClass: SocketUserService,
  scope: Scope.DEFAULT,
};
