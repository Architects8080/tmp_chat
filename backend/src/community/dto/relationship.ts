import { IsBoolean, IsNumber } from "class-validator";

export class RelationshipDto {
	@IsNumber()
	readonly userID: number;

	@IsNumber()
	readonly otherID: number;

	@IsBoolean()
	readonly isFriendly: boolean;
}