import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PostCommentReactDto } from '../post-comment-react.dto';

export class CreatePostCommentReactDto extends PostCommentReactDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'React ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid React ID' })
  reactId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Post Comment ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Post Comment ID' })
  postCommentId: string;
}
