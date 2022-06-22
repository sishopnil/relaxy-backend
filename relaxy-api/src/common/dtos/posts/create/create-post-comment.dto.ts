import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PostCommentDto } from '../post-comment.dto';

export class CreatePostCommentDto extends PostCommentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Post ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Post ID' })
  postId: string;
}
