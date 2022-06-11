import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'src/common/entities/tags.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, UserEntity])],
  controllers: [TagController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    TagService,
    PermissionService,
  ],
})
export class TagModule {}
