import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DmService } from './dm.service';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get()
  async getDM(
  @Query('userID') userID: string,
  @Query('friendID') friendID: string) {
    return this.dmService.getDMList(userID, friendID);
  }

  @Post()
  async sendDM(@Body() req) {
    return this.dmService.sendDM(req);
  }
}
