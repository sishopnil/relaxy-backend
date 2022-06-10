import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { FeelingDto } from '../feeling.dto';

export class CreateFeelingsDto extends FeelingDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Mood ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Mood ID' })
  moodId: string;
}
