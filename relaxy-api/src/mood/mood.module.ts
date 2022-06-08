import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { MoodController } from './controllers/mood.controller';
import { MoodService } from './services/mood.service';

@Module({
  imports: [TypeOrmModule.forFeature([MoodEntity])],
  controllers: [MoodController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    MoodService,
  ],
})
export class MoodModule {}
