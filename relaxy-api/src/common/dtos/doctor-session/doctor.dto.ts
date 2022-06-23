import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';
import { UserDto } from '../user/user.dto';
import { ServiceDto } from './service.dto';

export class DoctorDto extends BaseDto {
  @ApiProperty({ default: 'description' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(500, { message: 'Maximum 500 characters supported' })
  description: string;

  @Type(() => UserDto)
  user: UserDto;

  @Type(() => ServiceDto)
  services: ServiceDto[];
}

export class DoctorSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: 'description',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  description: string;
}
