import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TagIdDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Media ID must be defined' })
  @IsUUID('all', { message: 'Media ID must be an UUID' })
  id: string;
}
