import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getAllChannel() {
    const allChannels = await this.channelService.getAllChannel();
    return allChannels.filter((channel) => channel.isProtected !== 1);
  }

  @Get('me')
  async getMyChannel(@Req() req) {
    return this.channelService.getMyChannel(req.user.id);
  }

  @Post('enter-pw')
  async logIn(@Body() req) {
    return this.channelService.checkPassword(req.roomId, req.password);
  }
}
