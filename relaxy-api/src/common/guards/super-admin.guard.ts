import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/reponse/user-response.dto';
import { RoleNameEnum } from '../enums/role-name.enum';

import { SystemException } from '../exceptions/system.exception';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const error = { isGuard: true };

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req['_user'] as UserResponseDto;

    if (!user) {
      throw new SystemException(error);
    }

    if (user.roles.role === RoleNameEnum.SUPER_ADMIN_ROLE) {
      return true;
    }
    throw new SystemException(error);
  }
}
