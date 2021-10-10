import { IsNumber } from "class-validator";

export class CommunityDto {
	@IsNumber()
	readonly userID: number;

	@IsNumber()
	readonly otherID: number;
}