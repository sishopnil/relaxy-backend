import { Bool } from './../../../enums/bool.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({ default: '12345678' })
  @IsDefined({ message: 'Password must be defined' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiProperty()
  @IsInt({ message: 'Must be an integer value' })
  @IsEnum(Bool, { message: 'Can be either 0 or 1' })
  isChecked: Bool;
}
