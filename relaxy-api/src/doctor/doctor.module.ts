import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from 'src/common/entities/doctor.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ServiceEntity } from 'src/common/entities/service.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorEntity, ServiceEntity, UserEntity]),
  ],
  controllers: [DoctorController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    DoctorService,
    PermissionService,
  ],
})
export class DoctorModule {}
