import { ApiProperty } from '@nestjs/swagger';
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

export class ReactDto extends BaseDto {
  @ApiProperty({ default: 'LOVE' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  title: string;

  @ApiProperty({ default: 'LOVE' })
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
}

export class ReactSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: 'LOVE',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  title: string;

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