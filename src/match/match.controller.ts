import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get('user/:userId')
  getMatchByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.matchService.getMatchByUser(userId);
  }
}
