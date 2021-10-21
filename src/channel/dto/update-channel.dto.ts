import {
  IsEnum,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ChannelType } from '../entity/channel.entity';

export class UpdateChannelDto {
  @IsOptional()
  @MaxLength(20)
  title: string;
  @IsOptional()
  @IsEnum(ChannelType)
  type: ChannelType;
  @IsOptional()
  @Length(4, 4)
  @Matches('^[0-9]+$')
  password?: string;
}
