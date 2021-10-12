import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AchievementService } from './achievement.service';

@UseGuards(JwtAuthGuard)
@Controller('achievement')
export class AchievementController {
  constructor(
    private readonly achievementService: AchievementService,
  ) {}

  @Get('me')
  async getMyAchievementList(@Req() req) {
    return await this.achievementService.getAchievementByUser(req.user);
  }

  @Get(':id')
  async getAchievementListById(@Param('id', ParseIntPipe) id: number) {
    return await this.achievementService.getAchievementByUser(id);
  }
}
