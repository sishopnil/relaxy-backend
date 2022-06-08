import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable } from 'rxjs';
import { SystemException } from '../exceptions/system.exception';
import { DtoValidationException } from '../exceptions/validations/dto-validation.exception';

@Injectable()
export class FileExtender implements NestInterceptor {
  constructor(private readonly fields: string[]) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    console.log(req.body, req.file);
    // const media: MediaCreateDto = new MediaCreateDto();
    Object.values(this.fields).forEach((field) => {
      console.log({ [field]: req.body[field] });
      if (req.body[field] === undefined) {
      } else {
        req.file[field] = req.body[field];
      }
    });
    // const object = plainToClass(metatype, value);
    // const errors = await validate(media, {
    //   skipMissingProperties: true,
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    // });
    // console.log({ errors, media });

    // if (errors.length > 0) {
    //   throw new DtoValidationException(errors, 'DTO Validation Error');
    // }
    // throw new BadRequestException();
    return next.handle();
  }
}
