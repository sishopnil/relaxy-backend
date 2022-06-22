import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { StoryCommentDto } from '../story-comment.dto';

export class CreateStoryCommentDto extends StoryCommentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Feeling ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Feeling ID' })
  storyId: string;
}
