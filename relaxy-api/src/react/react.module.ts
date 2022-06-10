import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ReactEntity } from 'src/common/entities/react.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { ReactController } from './controllers/react.controller';
import { ReactService } from './services/react.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReactEntity])],
  controllers: [ReactController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    ReactService,
  ],
})
export class ReactModule {}
