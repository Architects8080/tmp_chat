// import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  // @IsString()
  readonly title: string;

  // @IsNumber()
  readonly type: number;

  // @IsOptional()
  // @IsString()
  readonly password: string;
}
