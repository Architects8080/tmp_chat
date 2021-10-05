import { JwtService } from '@nestjs/jwt';
import { cookieExtractor, JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server} from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DmService } from './dm.service';
import { SendDMDto } from './dto/sendDM';
import { SocketUser } from 'src/socket/socket-user';
import { SocketUserService } from './socket-user.service';

@UseGuards(JwtAuthGuard)
@WebSocketGateway(4500, { namespace: 'dm' })
export class DmGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private readonly dmService: DmService,
    private socketUserService: SocketUserService
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DmGateway');

  async handleConnection (client: SocketUser) {
    this.logger.log(`[connected] ${client.id}`);
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.addSocket(client);
    } catch (error) {
      console.log(error);
      client.disconnect(true);
    }
  }

  async handleDisconnect (client: SocketUser) {
    this.logger.log(`[disconnected] ${client.id}`);
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.removeSocket(client);

    } catch (error) {}
  }

  @SubscribeMessage('dmToServer')
  async handleMessage(@MessageBody() dm: SendDMDto) {
    this.dmService.sendDM(dm);
    const newDM = { id: dm.userID, message: dm.message };
    const user = await this.socketUserService.getSocketById(dm.userID);
    const friend = await this.socketUserService.getSocketById(dm.friendID);
    if (user) user.emit('dmToClient', newDM);
    if (friend) friend.emit('dmToClient', newDM);
  }
}