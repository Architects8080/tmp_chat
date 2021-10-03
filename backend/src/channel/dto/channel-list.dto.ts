// import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChannelListDto {
  roomId: number;

  // @IsString()
  title: string;

  // @IsNumber()
  isProtected: boolean;

  memberCount: number;
}
