<<<<<<< HEAD
// import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChannelListDto {
  roomId: number;

  // @IsString()
  title: string;

  // @IsNumber()
  isProtected: boolean;
=======
export class ChannelListDto {
  roomId: number;

  title: string;

  isProtected: number;
>>>>>>> a864136ce98e1c940db1ee791c31ad90ab99a749

  memberCount: number;
}
