import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReportEntity } from 'src/common/entities/post-report.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { PostReportController } from './controllers/post-report.controller';
import { PostReportService } from './services/post-report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostReportEntity, UserEntity, PostEntity]),
  ],
  controllers: [PostReportController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    PostReportService,
    PermissionService,
  ],
})
export class PostReportModule {}
