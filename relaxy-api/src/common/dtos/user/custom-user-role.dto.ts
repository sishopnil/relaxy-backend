import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleNameEnum } from './../../enums/role-name.enum';

export class CustomUserRoleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsEnum(RoleNameEnum, { message: 'Must be a valid role' })
  role: RoleNameEnum;
}
