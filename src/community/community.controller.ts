import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CommunityService } from './community.service';

@UseGuards(JwtAuthGuard)
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('friend')
  getFriendList(@Req() req) {
    return this.communityService.getRelationships(req.user.id, true);
  }

  @Get('block')
  getBlockList(@Req() req) {
    return this.communityService.getRelationships(req.user.id, false);
  }

  @Get('notification')
  getNotificationList(@Req() req) {
    return this.communityService.getNotifications(req.user.id);
  }

  @Get(':friendID')
  async getFriendByID(
    @Req() req,
    @Param('friendID', ParseIntPipe) friendID: number
  ) {
    const response = await this.communityService.getFriendByID({
      userID: req.user.id,
      otherID: friendID
    });
    if (response)
      return response.other;
    else
      return null;
  }
}
