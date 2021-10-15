import { IsNumber } from "class-validator";

export class NotificationDto {
	@IsNumber()
	readonly senderID: number;

	@IsNumber()
	readonly receiverID: number;

	@IsNumber()
	readonly targetID: number;

	@IsNumber()
	readonly type: number;
}