import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { StoryDto } from '../story.dto';

export class CreateFeelingsDto extends StoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Mood ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Mood ID' })
  moodId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Feeling ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Feeling ID' })
  feelingId: string;
}
