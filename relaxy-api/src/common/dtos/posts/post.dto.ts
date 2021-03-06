import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';
import { PostReportDto } from '../reports/post-report.dto';
import { UserDto } from '../user/user.dto';
import { PostCommentDto } from './post-comment.dto';
import { PostReactDto } from './post-react.dto';
import { PostTypeDto } from './post-type.dto';
import { TagDto } from './tags.dto';

export class PostDto extends BaseDto {
  @ApiProperty({ default: 'Test Description' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(150, { message: 'Maximum 65 characters supported' })
  description: string;

  @Type(() => UserDto)
  user: UserDto;

  @Type(() => PostTypeDto)
  postType: PostTypeDto;

  @Type(() => TagDto)
  tags: TagDto[];

  @Type(() => PostReactDto)
  postReacts: PostReactDto[];

  @Type(() => PostCommentDto)
  postComments: PostCommentDto[];

  @Type(() => PostReportDto)
  postReports: PostReportDto[];
}

export class PostSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: '',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  description: string;
}
