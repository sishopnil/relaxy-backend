import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';

export class DoctorSessionTypeDto extends BaseDto {
  @ApiProperty({ default: 'Service' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  title: string;
  
  @ApiProperty({ default: 'description' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(500, { message: 'Maximum 500 characters supported' })
  description: string;

  @ApiProperty({ default: './icon' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  icon: string;
}

export class DoctorSessionTypeSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: 'Service',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    default: 'description',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  description: string;
}
