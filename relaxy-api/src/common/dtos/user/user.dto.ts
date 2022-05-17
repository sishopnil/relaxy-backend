import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';

export class UserDto extends BaseDto {
  @ApiProperty({ default: 'Shovon' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  name: string;
}
