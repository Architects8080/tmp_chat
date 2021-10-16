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
import { CommunityDto } from './dto/community';

enum Result {
  Default = 0,
  Success,
  NotFoundUser,
  AlreadyFriend,
  Myself,
  InProgress,
  Block
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

  @SubscribeMessage('requestToServer')
  async requestMessage(
    @MessageBody() body: { otherID: number, isFriendly: boolean },
  	@ConnectedSocket() client: SocketUser
  ) {
    const friend = await this.socketUserService.getSocketById(body.otherID);
    const relationship: CommunityDto = {
      userID: client.user.id,
      otherID: body.otherID
    };

    if (body.isFriendly) {
      let responseCode = Result.Success;

      // 오류 체크
      try {
        await this.userService.getUserById(body.otherID);
      }
      catch (e) { responseCode = Result.NotFoundUser; }
      try {
        const result = await this.communityService.getFriendByID(relationship);
        if (result) responseCode = Result.AlreadyFriend;
      }
      catch (e) {}
      try {
        const result = await this.communityService.getBlockByID(relationship);
        if (result) responseCode = Result.Block;
      }
      catch (e) {}
      if (client.user.id == body.otherID) responseCode = Result.Myself;

      // 응답 전송
      if (friend && responseCode === Result.Success) {
        try { // 상대방의 차단 여부 체크
          await this.communityService.getBlockByID({
            userID: body.otherID,
            otherID: client.user.id
          });
        }
        catch (e) {
          try { // 중복 요청인지 체크
            const result = await this.communityService.setNotification({
              senderID: client.user.id,
              receiverID: body.otherID,
              targetID: client.user.id,
              type: 0
            });
            if (result)
              friend.emit('friendRequestToClient', client.user.id, client.user.nickname);
            else
              responseCode = Result.InProgress;
          }
          catch(e) {}
        }
      }
      client.emit('friendResponseToClient', responseCode);
    }
    else {
      await this.communityService.setRelationship(relationship, false);
      if (client) client.emit('blockResponseToClient', body.otherID);
    }
  }

  @SubscribeMessage('friendAcceptToServer')
  async acceptFriend(
    @MessageBody() friendID: number,
  	@ConnectedSocket() client: SocketUser
  ) {
    const friend = await this.socketUserService.getSocketById(friendID);
    await this.communityService.setRelationship({
      userID: client.user.id,
      otherID: friendID
    }, true);
    await this.communityService.deleteNotification({
      senderID: friendID,
      receiverID: client.user.id,
      targetID: friendID,
      type: 0
    });
    if (client) client.emit('friendAcceptToClient', friendID);
    if (friend) friend.emit('friendAcceptToClient', client.user.id);
  }

  @SubscribeMessage('friendRejectToServer')
  async rejectFriend(
    @MessageBody() friendID: number,
  	@ConnectedSocket() client: SocketUser
  ) {
    await this.communityService.deleteNotification({
      senderID: friendID,
      receiverID: client.user.id,
      targetID: friendID,
      type: 0
    });
  }

  @SubscribeMessage('relationDeleteToServer')
  async deleteRelationship(
    @MessageBody() body: { otherID: number, isFriendly: boolean },
  	@ConnectedSocket() client: SocketUser
  ) {
    const friend = await this.socketUserService.getSocketById(body.otherID);
    const relationship: CommunityDto = {
      userID: client.user.id,
      otherID: body.otherID
    };

    await this.communityService.deleteRelationshipByID(relationship, body.isFriendly);
    if (client)
      client.emit('relationDeleteToClient', body.otherID, body.isFriendly);
    if (friend && body.isFriendly)
      friend.emit('relationDeleteToClient', client.user.id, body.isFriendly);
  }
}