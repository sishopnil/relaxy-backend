import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ServiceEntity } from 'src/common/entities/service.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { ServiceController } from './controllers/service.controller';
import { ServiceService } from './services/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  controllers: [ServiceController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    ServiceService,
  ],
})
export class ServiceModule {}
