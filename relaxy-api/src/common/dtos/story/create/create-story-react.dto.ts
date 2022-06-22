import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { StoryReactDto } from '../story-react.dto';

export class CreateStoryReactDto extends StoryReactDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Mood ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Mood ID' })
  reactId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Feeling ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Feeling ID' })
  storyId: string;
}
