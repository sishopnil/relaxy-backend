import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/auth-guard.decorator';
import { SystemException } from '../exceptions/system.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.get<string[]>(
        ROLES_KEY,
        context.getHandler(),
      );
      // console.log({ roles });
      if (!roles) {
        throw new UnauthorizedException('Unauthorized login request');
      }
      const request = context.switchToHttp().getRequest();
      const user = request['_user'];
      if (!user) {
        throw new UnauthorizedException('Unauthorized login request');
      }
      // console.log({ r: roles, u: user.roles.role });

      const hasRole = roles.indexOf(user.roles.role);
      if (hasRole === -1) {
        throw new UnauthorizedException('Unauthorized login request');
      }
      return true;
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
