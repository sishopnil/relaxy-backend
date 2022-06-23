import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PostReactDto } from '../post-react.dto';

export class CreatePostReactDto extends PostReactDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'React ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid React ID' })
  reactId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Post ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Post ID' })
  postId: string;
}
