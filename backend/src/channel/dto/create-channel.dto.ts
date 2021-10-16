<<<<<<< HEAD
// import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  // @IsString()
  readonly title: string;

  // @IsNumber()
  readonly type: number;

  // @IsOptional()
  // @IsString()
  readonly password: string;
=======
export class CreateChannelDto {
  readonly title: string;

  readonly type: number;

  readonly password?: string;
>>>>>>> a864136ce98e1c940db1ee791c31ad90ab99a749

  ownerId: number;
}
