import {
  Body,
  Controller,
  Delete,
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

  @Get(':channelId/member')
  async getChannelMemeberList() {}

  @Put(':channelId/member')
  async joinChannel() {}

  @Delete(':channelId/member')
  async leaveChannel() {}

  @Roles('owner')
  @Put(':channelId/admin/:memberId')
  async grantAdmin() {}

  @Roles('owner')
  @Delete(':channelId/admin/:memberId')
  async revokeAdmin() {}

  @Put(':channelId/mute/:memberId')
  async muteMember() {}

  @Put(':channelId/ban/:memberId')
  async banMember() {}
}
