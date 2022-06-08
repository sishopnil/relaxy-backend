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
import { MoodDto } from './mood.dto';

export class FeelingDto extends BaseDto {
  @ApiProperty({ default: 'Shovon' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 characters supported' })
  title: string;

  @ApiProperty({ default: 'Shovon' })
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

  @Type(() => MoodDto)
  mood: MoodDto;
}

// export class UserSearchDto extends ApiQueryPaginationBaseDTO {
//   @ApiProperty({
//     default: 'Shovon',
//     required: false,
//     type: String,
//   })
//   @IsOptional()
//   @IsString()
//   name: string;

//   @ApiProperty({
//     default: 'relaxy123@gmail.com',
//     required: false,
//     type: String,
//   })
//   @IsOptional()
//   @IsEmail()
//   email: string;

//   @ApiProperty({
//     default: 'Team Lead',
//     required: false,
//     type: String,
//   })
//   @IsOptional()
//   @IsString()
//   address: string;

//   @ApiProperty({
//     required: false,
//     default: RoleNameEnum.SUPER_ADMIN_ROLE,
//     enum: RoleNameEnum,
//   })
//   @IsOptional()
//   @IsString({
//     message: `Must be one of those ${Object.entries(RoleNameEnum).join('/')}`,
//   })
//   @IsEnum(RoleNameEnum)
//   roleName: RoleNameEnum;
// }
