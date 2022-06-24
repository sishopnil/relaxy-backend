import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BugReportEntity } from 'src/common/entities/bug-report.entity';
import { PostReportEntity } from 'src/common/entities/post-report.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { BugReportController } from './controllers/bug-report.controller';
import { BugReportService } from './services/bug-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([BugReportEntity, UserEntity])],
  controllers: [BugReportController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    BugReportService,
    PermissionService,
  ],
})
export class BugReportModule {}
