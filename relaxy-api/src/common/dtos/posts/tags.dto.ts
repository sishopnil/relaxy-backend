import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { BaseDto } from '../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../pagination/api-query-pagination-base.dto';
import { UserDto } from '../user/user.dto';

export class TagDto extends BaseDto {
  @ApiProperty({ default: 'Test tag' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(150, { message: 'Maximum 65 characters supported' })
  title: string;

  @ApiProperty({ default: ActiveStatus.ACTIVE })
  @IsOptional({})
  @IsString({ message: 'Must be a string!' })
  @IsEnum(ActiveStatus, {
    message: 'Can be either Active or Inactive',
  })
  status: ActiveStatus;

  @Type(() => UserDto)
  users: UserDto[];
}

export class TagSearchDto extends ApiQueryPaginationBaseDTO {
  @ApiProperty({
    default: '',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  description: string;
}
