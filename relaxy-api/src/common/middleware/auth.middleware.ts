import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { ConfigureEnum } from '../enums/configure.enum';
import * as Redis from 'ioredis';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private redis = {};
  constructor(private readonly configService: ConfigService) {
    this.redis[ConfigureEnum.REDIS_SESSION] = new Redis(
      configService.get(ConfigureEnum.REDIS_SESSION),
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split('Bearer ')[1];
      if (token) {
        const _user = await this.redis[ConfigureEnum.REDIS_SESSION].get(token);
        if (_user) req['_user'] = JSON.parse(_user);
      }
      next();
    } catch (error) {
      throw new UnauthorizedException('Authorization is denied');
    }
  }
}
