import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID must be defined' })
  @IsUUID('all', { message: 'ID must be an UUID' })
  id: string;
}
