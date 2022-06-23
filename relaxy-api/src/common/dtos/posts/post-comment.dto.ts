import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { PostCommentReactDto } from './post-comment-react.dto';
import { PostDto } from './post.dto';

export class PostCommentDto extends BaseDto {
  @ApiProperty({ default: 'Test Description' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(150, { message: 'Maximum 65 characters supported' })
  description: string;

  @Type(() => PostDto)
  post: PostDto;

  @Type(() => UserDto)
  commentBy: UserDto;

  @Type(() => PostCommentReactDto)
  postCommentReacts: PostCommentReactDto[];
}
