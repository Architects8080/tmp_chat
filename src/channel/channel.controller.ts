import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/channel/guard/roles.guard';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getChannelList() {}

  @Get('me')
  async getMyChannelList() {}

  @Post()
  async createChannel() {}

  @Delete(':channelId')
  async deleteChannel() {}

  @Get(':channelId/member')
  async getChannelMemeberList() {}

  @Put(':channelId/member')
  async joinChannel() {}

  @Delete(':channelId/member')
  async leaveChannel() {}

  @Put(':channelId/admin/:memberId')
  async grantAdmin() {}

  @Delete(':channelId/admin/:memberId')
  async revokeAdmin() {}

  @Put(':channelId/mute/:memberId')
  async muteMember() {}

  @Put(':channelId/ban/:memberId')
  async banMember() {}
}
