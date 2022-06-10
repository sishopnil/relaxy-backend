import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { FeelingDto } from './feeling.dto';
import { MoodDto } from './mood.dto';

export class StoryDto extends BaseDto {
  @ApiProperty({ default: 'Test Description' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(150, { message: 'Maximum 65 characters supported' })
  description: string;

  @ApiProperty({ default: new Date(), required: true })
  @IsNotEmpty({ message: 'Date must be defined' })
  @IsDateString({ strict: true }, { message: 'Must be a valid date' })
  expireDate: Date | null;

  @Type(() => UserDto)
  user: UserDto;

  @Type(() => MoodDto)
  mood: MoodDto;

  @Type(() => FeelingDto)
  feeling: FeelingDto;
}
