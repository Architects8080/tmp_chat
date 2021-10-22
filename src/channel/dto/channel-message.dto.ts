import { IsNotEmpty } from 'class-validator';

export class ChannelMessageDto {
  @IsNotEmpty()
  channelId: number;

  @IsNotEmpty()
  message: string;
}
