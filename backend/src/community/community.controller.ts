import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ComunityService } from './community.service';

@Controller('comunity')
export class ComunityController {
	constructor(private readonly comunityService: ComunityService) {}

	@Get('friend')
	async getFriends(@Query('userID') userID: number) {
	  return this.comunityService.getRelationships(userID, true);
	}

	@Post('friend')
	async setFriend(@Body() req) {
	  return this.comunityService.setRelationship(req, true);
	}

	@Get('ban')
	async getBans(@Query('userID') userID: number) {
	  return this.comunityService.getRelationships(userID, false);
	}

	@Post('ban')
	async setBan(@Body() req) {
	  return this.comunityService.setRelationship(req, false);
	}

	@Delete()
	async deleteRelationship(
	  @Query('userID') userID: number,
	  @Query('otherID') otherID: number
	) {
	  return this.comunityService.deleteRelationshipByID(userID, otherID);
	}
}
