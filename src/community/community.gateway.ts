import { JwtService } from '@nestjs/jwt';
import { cookieExtractor, JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { Logger, UseGuards } from '@nestjs/common';
import {
	ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server} from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SocketUser } from 'src/socket/socket-user';
import { SocketUserService } from './socket-user.service';
import { CommunityService } from './community.service';
import { SendDMDto } from 'src/dm/dto/sendDM';
import { DmService } from 'src/dm/dm.service';
import { UserService } from 'src/user/user.service';

enum Result {
  Default = 0,
  Success,
  NotFoundUser,
  AlreadyFriend,
  Myself,
}

@UseGuards(JwtAuthGuard)
@WebSocketGateway(4500, { namespace: 'community' })
export class CommunityGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private dmService: DmService,
    private communityService: CommunityService,
    private userService: UserService,
    private socketUserService: SocketUserService
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('CommunityGateway');

  async handleConnection (client: SocketUser) {
    this.logger.log(`[connected] ${client.id}`);
    try {
      const token = cookieExtractor(client);
      const userPayload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(userPayload);
      client.user = user;
      this.socketUserService.addSocket(client);
      // // 친구에게 접속 알림 !!테스트 필요
      // const friendList = await this.communityService.getRelationships(client.user.id, true);
      // friendList.map(async (friend) => {
      //   const friendSocket = await this.socketUserService.getSocketById(friend.otherID);
      //   friendSocket.emit('connect');
      // });
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
      // // 친구에게 접속종료 알림 !!테스트 필요
      // const friendList = await this.communityService.getRelationships(client.user.id, true);
      // friendList.map(async (friend) => {
      //   const friendSocket = await this.socketUserService.getSocketById(friend.otherID);
      //   friendSocket.emit('disconnect');
      // });
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

  @SubscribeMessage('friendRequestToServer')
  async requestMessage(
    @MessageBody() friendID: number,
  	@ConnectedSocket() client: SocketUser
  ) {
    const friend = await this.socketUserService.getSocketById(friendID);
    let responseCode = Result.Success;

    if (friend) friend.emit('friendRequestToClient', client.user.id);

    try {
      await this.userService.getUserById(friendID);
    }
    catch (e) { responseCode = Result.NotFoundUser; }
    try {
      const result = await this.communityService.getRelationshipByID({
        userID: client.user.id,
        otherID: friendID
      });
      if (result) responseCode = Result.AlreadyFriend;
    }
    catch (e) {}
    if (client.user.id == friendID) responseCode = Result.Myself;

    client.emit('friendResponseToClient', responseCode);
  }

  @SubscribeMessage('friendAcceptToServer')
  async replyMessage(
    @MessageBody() reply: {friendID: number},
  	@ConnectedSocket() client: SocketUser
  ) {
    const friend = await this.socketUserService.getSocketById(reply.friendID);
    this.communityService.setRelationship({
      userID: client.user.id,
      otherID: reply.friendID
    }, true);
    if (client) client.emit('friendAcceptToClient', reply.friendID);
    if (friend) friend.emit('friendAcceptToClient', client.user.id);
  }
}