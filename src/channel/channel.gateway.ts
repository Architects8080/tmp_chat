import { Inject, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { cookieExtractor, JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { SocketUser } from 'src/socket/socket-user';
import { SocketUserService } from 'src/socket/socket-user.service';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway(4501, { namespace: 'channel' })
export class ChannelGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private channelService: ChannelService,
    @Inject('CHANNEL_SOCKET_USER_SERVICE')
    private socketUserService: SocketUserService,
  ) {}
  @WebSocketServer() server: Server;

  async handleConnection(client: SocketUser) {
    console.log(`Client ${client.id} Connected to channel`);
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      console.log(client.rooms);
      console.log(user.id, user.intraLogin);
      this.socketUserService.addSocket(client);
    } catch (error) {
      console.log(error);
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

  @SubscribeMessage('createChannel')
  async createChannel(
    @MessageBody() data: CreateChannelDto,
    @ConnectedSocket() client: SocketUser,
  ) {
    data.ownerId = client.user.id;
    const channelId = await this.channelService.createChannel(data);
    this.server.emit('channelCreated', channelId);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(
    @MessageBody() data: any,
    @ConnectedSocket() client: SocketUser,
  ) {
    client.join(data.toString());
    this.channelService.joinChannel(data, client.user.id);
    console.log(client.rooms);
  }

  @SubscribeMessage('msgToChannel')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: SocketUser,
  ) {
    const payload = {
      text: data.text,
      name: client.user.nickname,
    };
    this.server.to(data.roomId).emit('msgToClient', payload);
  }

  @SubscribeMessage('leaveChannel')
  leaveChannel(
    @MessageBody() data: any,
    @ConnectedSocket() client: SocketUser,
  ) {
    this.channelService.leaveChannel(data, client.user.id);
  }
}
