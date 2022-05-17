import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseDto } from '../dtos/core/base.dto';
import { UserResponseDto } from '../dtos/reponse/user-response.dto';
import { CustomBaseEntity } from '../entities/custom-base.entity';

@Injectable()
export class RequestService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  forCreate<T extends BaseDto>(dto: T): T {
    if (dto) {
      dto.createAt = new Date();
      dto.createdBy = this.request['_user']?.id || null;

      dto.updatedAt = new Date();
      dto.updatedBy = dto.createdBy;

      return dto;
    } else {
      throw new NotFoundException('No data specified!');
    }
  }

  forCreateEntity<T extends CustomBaseEntity>(entity: T): T {
    if (entity) {
      entity.createAt = new Date();
      entity.createdBy = this.request['_user']?.id || null;

      entity.updatedAt = new Date();
      entity.updatedBy = entity.createdBy;

      return entity;
    } else {
      throw new NotFoundException('No data specified!');
    }
  }

  forUpdate<T extends BaseDto>(dto: T): T {
    if (dto) {
      dto.updatedAt = new Date();
      dto.updatedBy = this.request['_user']?.id || null;

      return dto;
    } else {
      throw new NotFoundException('No data specified!');
    }
  }

  forUpdateEntity<T extends CustomBaseEntity>(entity: T): T {
    if (entity) {
      entity.updatedAt = new Date();
      entity.updatedBy = this.request['_user']?.id || null;

      return entity;
    } else {
      throw new NotFoundException('No data specified!');
    }
  }

  userSession(): UserResponseDto {
    try {
      const user: UserResponseDto = this.request['_user'] || null;
      if (user) {
        return user;
      } else {
        throw new UnauthorizedException('You are not Loggin');
      }
    } catch (error) {
      throw new UnauthorizedException('You are not Loggin');
    }
  }
}
