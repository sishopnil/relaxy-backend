import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleNameEnum } from '../enums/role-name.enum';
import { RolesGuard } from '../guards/roles-guard';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['_user'] ?? undefined;
  },
);

export const ROLES_KEY = 'roles';
export function AuthWithRoles(roles: RoleNameEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
  );
}
