import { Inject, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { validate, Validator } from 'class-validator';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { cookieExtractor, JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { SocketUser } from 'src/socket/socket-user';
import { SocketUserService } from 'src/socket/socket-user.service';
import { ChannelEventService } from './channel-event.service';
import { ChannelService } from './channel.service';
import { CHANNEL_SOCKET_USER_SERVICE_PROVIDER } from './channel.socket-user.service';
import { ChannelMessageDto } from './dto/channel-message.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway(4501, { namespace: 'channel' })
export class ChannelGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private channelService: ChannelService,
    @Inject(CHANNEL_SOCKET_USER_SERVICE_PROVIDER)
    private socketUserService: SocketUserService,
    private channelEventService: ChannelEventService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.channelEventService.server = this.server;
  }

  async handleConnection(client: SocketUser) {
    console.log(`Client ${client.id} Connected to channel`);
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.addSocket(client);
    } catch (error) {
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: SocketUser) {
    console.log(`Client ${client.id} Disconnected`);
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.removeSocket(client);
    } catch (error) {}
  }

  @SubscribeMessage('subscribeChannel')
  async subscribeChannel(
    @ConnectedSocket() client: SocketUser,
    channelId: number,
  ) {
    if (this.channelService.isJoinChannel(client.user.id, channelId))
      client.join(`channel:${channelId}`);
  }

  @SubscribeMessage('unsubscribeChannel')
  async unsubscribeChannel(
    @ConnectedSocket() client: SocketUser,
    channelId: number,
  ) {
    client.leave(`channel:${channelId}`);
  }

  @SubscribeMessage('messageToServer')
  async receiveMessage(
    @ConnectedSocket() client: SocketUser,
    dto: ChannelMessageDto,
  ) {
    const validatorError = await validate(dto);
    if (validatorError.length > 0) return;
    const result = await this.channelService.createMessage(
      dto.channelId,
      client.user.id,
      dto.message,
    );
    this.server.to(`channel:${dto.channelId}`).emit('messageToClient', result);
  }
}
