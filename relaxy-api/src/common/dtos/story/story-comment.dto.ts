import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { StoryDto } from './story.dto';

export class StoryCommentDto extends BaseDto {
  @ApiProperty({ default: 'Test Description' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(150, { message: 'Maximum 65 characters supported' })
  description: string;

  @Type(() => StoryDto)
  story: StoryDto;

  @Type(() => UserDto)
  commentBy: UserDto;
}


