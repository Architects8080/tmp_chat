import {
  IsEnum,
  IsOptional,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ChannelType } from '../entity/channel.entity';

export class CreateChannelDto {
  title: string;
  @IsEnum(ChannelType)
  type: ChannelType;
  @IsOptional()
  @ValidateIf((dto: CreateChannelDto) => {
    return dto.type == ChannelType.PROTECTED;
  })
  @Length(4, 4)
  @Matches('^[0-9]+$')
  password?: string;
}
