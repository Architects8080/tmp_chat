import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/channel/guard/roles.guard';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { MemberGuard } from './guard/member.guard';
import { Roles } from './guard/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getChannelList() {
    return await this.channelService.getChannelList();
  }

  @Get('me')
  async getMyChannelList(@Req() req) {
    return await this.channelService.getChannelListByUser(req.user.id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createChannel(@Req() req, @Body() body: CreateChannelDto) {
    return await this.channelService.createChannel(req.user.id, body);
  }

  @Roles('owner')
  @Delete(':channelId')
  async deleteChannel(
    @Param('channelId', new ParseIntPipe()) channelId: number,
  ) {
    return await this.channelService.deleteChannel(channelId);
  }

  @Roles('owner')
  @Put(':channelId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateChannel(
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Body() body: UpdateChannelDto,
  ) {
    return await this.channelService.updateChannel(channelId, body);
  }

  @Roles('owner', 'admin', 'member')
  @Get(':channelId/member')
  async getChannelMemeberList(
    @Req() req,
    @Param('channelId', new ParseIntPipe()) channelId: number,
  ) {
    if (await this.channelService.isJoinChannel(req.user.id, channelId))
      return await this.channelService.getChannelMemberList(channelId);
    else throw new ForbiddenException();
  }

  @Post(':channelId/member')
  async joinChannel(
    @Req() req,
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Body('password') password: string,
  ) {
    return await this.channelService.joinChannel(
      req.user.id,
      channelId,
      password,
    );
  }

  @Roles('owner', 'admin', 'member')
  @Delete(':channelId/member')
  async leaveChannel(
    @Req() req,
    @Param('channelId', new ParseIntPipe()) channelId: number,
  ) {
    return await this.channelService.leaveChannel(req.user.id, channelId);
  }

  @Roles('owner', 'admin', 'member')
  @Post(':channelId/invite/:userId')
  async inviteUser(
    @Req() req,
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    return await this.channelService.inviteUser(req.user.id, channelId, userId);
  }

  @Roles('owner')
  @UseGuards(MemberGuard)
  @Put(':channelId/admin/:memberId')
  async grantAdmin(
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ) {
    return await this.channelService.grantAdmin(channelId, memberId);
  }

  @Roles('owner')
  @UseGuards(MemberGuard)
  @Delete(':channelId/admin/:memberId')
  async revokeAdmin(
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ) {
    return await this.channelService.revokeAdmin(channelId, memberId);
  }

  @Roles('owner', 'admin')
  @UseGuards(MemberGuard)
  @Put(':channelId/mute/:memberId')
  async muteMember(
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ) {
    return await this.channelService.muteMember(channelId, memberId);
  }

  @Roles('owner', 'admin')
  @UseGuards(MemberGuard)
  @Put(':channelId/ban/:memberId')
  async banMember(
    @Param('channelId', new ParseIntPipe()) channelId: number,
    @Param('memberId', new ParseIntPipe()) memberId: number,
  ) {
    return await this.channelService.banMember(channelId, memberId);
  }

  @Roles('owner', 'admin', 'member')
  @Get(':channelId/message')
  async getChannelMessageList(
    @Param('channelId', new ParseIntPipe()) channelId: number,
  ) {
    return await this.channelService.getChannelMessageList(channelId);
  }
}
