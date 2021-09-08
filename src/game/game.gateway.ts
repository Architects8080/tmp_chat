import { Inject, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { cookieExtractor, JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { SocketUser } from 'src/socket/socket-user';
import { GameInfo } from './data/gameinfo.data';
import { GameService } from './game.service';
import { SocketUserService } from '../socket/socket-user.service';

@UseGuards(JwtAuthGuard)
@WebSocketGateway(4000, { namespace: 'game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private gameService: GameService,
    @Inject('GAME_SOCKET_USER_SERVICE')
    private socketUserService: SocketUserService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: SocketUser, ...args: any[]) {
    console.log('Client Connected');
    try {
      const token = cookieExtractor(client); //error
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.addSocket(client);
    } catch (error) {
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: SocketUser) {
    console.log('Client Disconnected');
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.removeSocket(client);
    } catch (error) {}
  }

  @SubscribeMessage('invite')
  inviteGame(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const targetUserId = data[0];
    const targetUser = this.socketUserService.getSocketById(targetUserId);

    if (targetUser) {
      const roomId: number = this.gameService.invite(
        client.user.id,
        targetUser.user.id,
      );

      targetUser.emit(
        'invite',
        client.user.nickname,
        client.user.avatar,
        roomId,
      );
    }
  }

  @SubscribeMessage('accept')
  acceptGame(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const roomId = data[0];
    const acceptedRoom = this.gameService.accept(client.user.id, roomId);

    if (acceptedRoom) {
      const player1 = this.socketUserService.getSocketById(
        acceptedRoom.player1.id,
      );
      const player2 = this.socketUserService.getSocketById(
        acceptedRoom.player2.id,
      );

      if (!player1 || !player2) {
        // exception
      }
      player1.emit('ready', roomId);
      player2.emit('ready', roomId);

      player1.join('gameroom:' + roomId.toString());
      player2.join('gameroom:' + roomId.toString());

      this.gameService.start(roomId, (gameInfo: GameInfo) => {
        this.server
          .in('gameroom:' + roomId.toString())
          .emit('update', roomId, gameInfo);
      });
    }
  }

  @SubscribeMessage('cancel')
  cancelGame(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const roomId = data[0];
    const canceledPlayerId = this.gameService.cancel(client.user.id, roomId);
    const canceledPlayer =
      this.socketUserService.getSocketById(canceledPlayerId);

    if (canceledPlayer) canceledPlayer.emit('cancel', roomId);
  }

  @SubscribeMessage('move')
  movePlayer(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const roomId = +data[0];
    const moveInfo = data[1];

    console.log(
      `roomId : `,
      roomId,
      `client.user.id : `,
      client.user.id,
      `moveInfo : `,
      moveInfo,
    );
    this.gameService.move(roomId, client.user.id, moveInfo);
  }
}
