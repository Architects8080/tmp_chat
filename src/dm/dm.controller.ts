import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DmService } from './dm.service';

@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get()
  async getDM(@Req() req) {
    return await this.dmService.getDMList(req.user.id, req.query.friendID);
  }

  @Post()
  async sendDM(@Body() req) {
    return this.dmService.sendDM(req);
  }
}
