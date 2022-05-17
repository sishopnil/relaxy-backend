import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserResponseDto } from '../dtos/reponse/user-response.dto';
import { RoleNameEnum } from '../enums/role-name.enum';

@Injectable()
export class PermissionService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  returnRequest = (): UserResponseDto => {
    const user: UserResponseDto = this.request['_user'] as UserResponseDto;
    return user ? user : null;
  };

  // superAdmin = (): { user: string; status: boolean } => {
  //   const user: UserResponseDto = this.request['_user'] as UserResponseDto;
  //   if (user) {
  //     if (user.roles.role === RoleName.SUPER_ADMIN_ROLE) {
  //       return {
  //         user: user.SuperAdminId,
  //         status: true,
  //       };
  //     }
  //   }
  //   return {
  //     user: null,
  //     status: false,
  //   };
  // };

  // admin = (): { user: string; status: boolean } => {
  //   const user: UserResponseDto = this.request['_user'] as UserResponseDto;
  //   if (user) {
  //     if (
  //       user.roles.role === RoleName.SUPER_ADMIN_ROLE ||
  //       user.roles.role === RoleName.ADMIN_ROLE
  //     ) {
  //       return {
  //         user: user.AdminId,
  //         status: true,
  //       };
  //     }
  //   }
  //   return {
  //     user: null,
  //     status: false,
  //   };
  // };

  // editor = (): { user: string; status: boolean } => {
  //   const user: UserResponseDto = this.request['_user'] as UserResponseDto;
  //   if (user) {
  //     if (
  //       user.roles.role === RoleName.SUPER_ADMIN_ROLE ||
  //       user.roles.role === RoleName.ADMIN_ROLE ||
  //       user.roles.role === RoleName.EDITOR_ROLE
  //     ) {
  //       return {
  //         user: user.EditorId,
  //         status: true,
  //       };
  //     }
  //   }
  //   return {
  //     user: null,
  //     status: false,
  //   };
  // };
}
