import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeelingEntity } from 'src/common/entities/feeling.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { FeelingsController } from './controllers/feelings.controller';
import { FeelingsService } from './services/feelings.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeelingEntity, MoodEntity])],
  controllers: [FeelingsController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    FeelingsService,
  ],
})
export class FeelingsModule {}
