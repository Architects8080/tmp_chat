import { IsNumber, IsString } from "class-validator";

export class SendDMDto {
	@IsNumber()
	readonly userID: number;

	@IsNumber()
	readonly friendID: number;

	@IsString()
	readonly message: string;
}