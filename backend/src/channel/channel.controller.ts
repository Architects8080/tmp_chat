import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getAll() {
    return this.channelService.getAllChannel();
  }

  @Get('me')
  async getMyChannel(@Req() req) {
    return this.channelService.getMyChannel(req);
  }
}
