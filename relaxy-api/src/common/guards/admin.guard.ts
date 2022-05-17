import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/reponse/user-response.dto';
import { RoleNameEnum } from '../enums/role-name.enum';
import { SystemException } from '../exceptions/system.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req['_user'] as UserResponseDto;
    const error = { isGuard: true };
    console.log(user);

    if (!user) {
      throw new SystemException(error);
    }

    if (
      user.roles.role === RoleNameEnum.SUPER_ADMIN_ROLE ||
      user.roles.role === RoleNameEnum.ADMIN_ROLE
    ) {
      return true;
    }

    throw new SystemException(error);
  }
}
