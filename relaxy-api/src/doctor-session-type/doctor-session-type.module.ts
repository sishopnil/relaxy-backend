import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSessionTypeEntity } from 'src/common/entities/doctor-session-type.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { DoctorSessionTypeController } from './controllers/doctor-session-type.controller';
import { DoctorSessionTypeService } from './services/doctor-session-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSessionTypeEntity])],
  controllers: [DoctorSessionTypeController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    DoctorSessionTypeService,
  ],
})
export class DoctorSessionTypeModule {}
