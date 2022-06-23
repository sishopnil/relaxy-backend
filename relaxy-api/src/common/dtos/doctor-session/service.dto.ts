import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';
import { DoctorDto } from './doctor.dto';

export class ServiceDto extends BaseDto {
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

  @ApiProperty({ default: ActiveStatus.ACTIVE })
  @IsOptional({})
  @IsString({ message: 'Must be a string!' })
  @IsEnum(ActiveStatus, {
    message: 'Can be either Active or Inactive',
  })
  status: ActiveStatus;

  @Type(() => DoctorDto)
  doctors: DoctorDto[];
}

export class ServiceSearchDto extends ApiQueryPaginationBaseDTO {
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

  @ApiProperty({
    required: false,
    default: ActiveStatus.ACTIVE,
    enum: ActiveStatus,
  })
  @IsOptional()
  @IsString({
    message: `Must be one of those ${Object.entries(ActiveStatus).join('/')}`,
  })
  @IsEnum(ActiveStatus)
  status: ActiveStatus;
}
