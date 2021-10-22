import { Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketUserService } from 'src/socket/socket-user.service';
import { CHANNEL_SOCKET_USER_SERVICE_PROVIDER } from './channel.socket-user.service';
import { CountChannel } from './data/count-channel.data';
import { ChannelMember } from './entity/channel-member.entity';
import { Channel } from './entity/channel.entity';

@Injectable()
export class ChannelEventService {
  constructor(
    @Inject(CHANNEL_SOCKET_USER_SERVICE_PROVIDER)
    private socketUserService: SocketUserService,
  ) {}

  server: Server;

  toChannelRoom(channelId: number) {
    return this.server.to(`channel:${channelId}`);
  }

  addChannelMember(channelId: number, member: ChannelMember) {
    this.toChannelRoom(channelId).emit('addChannelMember', channelId, member);
  }

  removeChannelMember(channelId: number, userId: number) {
    this.toChannelRoom(channelId).emit(
      'removeChannelMember',
      channelId,
      userId,
    );
  }

  updateChannelMember(channelId: number, member: ChannelMember) {
    this.toChannelRoom(channelId).emit(
      'updateChannelMember',
      channelId,
      member,
    );
  }

  muteMember(channelId: number, memberId: number, expired: Date) {
    const memberSocket = this.socketUserService.getSocketById(memberId);
    if (memberSocket) memberSocket.emit('muteMember', channelId, expired);
  }

  unmuteMember(channelId: number, memberId: number) {
    const memberSocket = this.socketUserService.getSocketById(memberId);
    if (memberSocket) memberSocket.emit('unmuteMember', channelId);
  }

  updateChannel(channel: CountChannel) {
    this.server.emit('updateChannel', channel);
  }

  deleteChannel(channelId: number) {
    this.server.emit('deleteChannel', channelId);
  }

  addChannelList(channel: CountChannel) {
    this.server.emit('addChannel', channel);
  }

  removeChannelList(channelId: number) {
    this.server.emit('removeChannel', channelId);
  }

  addMyChannel(userId: number, channel: CountChannel) {
    const socket = this.socketUserService.getSocketById(userId);
    if (socket) socket.emit('addMyChannel', channel);
  }

  removeMyChannel(userId: number, channelId: number) {
    const socket = this.socketUserService.getSocketById(userId);
    if (socket) socket.emit('removeMyChannel', channelId);
  }
}
