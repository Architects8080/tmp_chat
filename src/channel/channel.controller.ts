import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/channel/guard/roles.decorator';
import { RolesGuard } from 'src/channel/guard/roles.guard';
import { ChannelService } from './channel.service';
import { UpdateChannelDto } from './dto/update-channel.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get(':id')
  getOneChannel(@Param('id') roomId: number) {
    return this.channelService.channelMap.get(+roomId);
  }

  @Get('/members/:id')
  async getChannelMember(@Param('id') roomId: number) {
    return this.channelService.getChannelMember(+roomId);
  }

  @Post('enter-pw')
  async logIn(@Body() req) {
    return this.channelService.checkPassword(req.roomId, req.password);
  }

  @Put(':id')
  @Roles('owner')
  async updateChannel(
    @Param('id') roomId: number,
    @Body() updateData: UpdateChannelDto,
  ) {
    return this.channelService.updateChannel(roomId, updateData);
  }
}
