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
import { GameRoomService } from './game-room.service';
import { GamePlayer } from './data/game-player.data';
import { GameRoom } from './data/gameroom.data';

@UseGuards(JwtAuthGuard)
@WebSocketGateway(4000, { namespace: 'game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private gameService: GameService,
    private gameRoomService: GameRoomService,
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
      const existUser = this.socketUserService.getSocketById(user.id);
      if (existUser) {
        existUser.rooms.forEach((room) => {
          client.join(room);
        });
        existUser.disconnect(true);
      } else {
        const room = this.gameRoomService.getJoinedRoom(user.id);
        if (room) client.join('gameroom:' + room);
      }
      this.socketUserService.addSocket(client);
    } catch (error) {
      console.log(error);
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
    console.log(data);
    const targetUserId = data[0];
    const mapSetting = data[1];
    const targetUser = this.socketUserService.getSocketById(targetUserId);

    if (targetUser) {
      const roomId: number = this.gameRoomService.invite(
        client.user.id,
        targetUser.user.id,
        mapSetting,
      );

      targetUser.emit(
        'invite',
        client.user.nickname,
        client.user.avatar,
        roomId,
      );
    }
  }

  @SubscribeMessage('observe')
  observeGame(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const roomId = +data[0];
    if (this.gameRoomService.isPlayingRoom(roomId)) {
      client.join('gameroom:' + roomId.toString());
    } else {
      client.emit('vanished', roomId.toString());
    }
  }

  @SubscribeMessage('accept')
  acceptGame(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const roomId = data[0];
    const acceptedRoom = this.gameRoomService.accept(client.user.id, roomId);

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

      this.gameService.start(
        roomId,
        (gameInfo: GameInfo) => {
          this.server
            .in('gameroom:' + roomId.toString())
            .emit('update', roomId, gameInfo);
        },
        (gameInfo: GameInfo) => {
          let winner: GamePlayer;
          let loser: GamePlayer;
          if (gameInfo.player1.score >= gameInfo.player2.score) {
            winner = gameInfo.player1;
            loser = gameInfo.player2;
          } else {
            winner = gameInfo.player2;
            loser = gameInfo.player1;
          }
          const winnerUser = this.socketUserService.getSocketById(winner.id);
          this.server
            .in('gameroom:' + roomId.toString())
            .emit('gameover', roomId, {
              winnerProfile: {
                nickname: winnerUser.user.nickname,
                avatar: winnerUser.user.avatar,
              },
              score: {
                winnerScore: winner.score,
                loserScore: loser.score,
              },
            });
        },
      );
    }
  }

  @SubscribeMessage('cancel')
  cancelGame(
    @MessageBody() data: any[],
    @ConnectedSocket() client: SocketUser,
  ) {
    const roomId = data[0];
    const canceledPlayerId = this.gameRoomService.cancel(
      client.user.id,
      roomId,
    );
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
