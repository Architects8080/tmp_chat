import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CommunityService } from './community.service';
import { CommunityDto } from './dto/community';

@UseGuards(JwtAuthGuard)
@Controller('community')
export class CommunityController {
	constructor(private readonly communityService: CommunityService) {}

	@Get('friend')
	async getFriendList(@Req() req) {
	  return this.communityService.getRelationships(req.user.id, true);
	}

	@Post('friend')
	async setFriend(@Body() req) {
	  return this.communityService.setRelationship(req, true);
	}

	@Delete('friend')
	async deleteFriend(@Req() req) {
      const relationship: CommunityDto = {userID: req.user.id, otherID: req.query.otherID};
	  return this.communityService.deleteRelationshipByID(relationship, true);
	}

	@Get('block')
	async getBlockList(@Req() req) {
	  return this.communityService.getRelationships(req.user.id, false);
	}

	@Post('block')
	async setBlock(@Body() req) {
	  return this.communityService.setRelationship(req, false);
	}

	@Delete('block')
	async deleteBlock(@Req() req) {
      const relationship: CommunityDto = {userID: req.user.id, otherID: req.query.otherID};
	  return this.communityService.deleteRelationshipByID(relationship, false);
	}
}
