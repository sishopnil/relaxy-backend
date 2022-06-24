import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { QuestionnaireEntity } from 'src/common/entities/questionnaire.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { QuestionnaireController } from './controllers/questionnaire.controller';
import { QuestionnaireService } from './services/questionnaire.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionnaireEntity])],
  controllers: [QuestionnaireController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    QuestionnaireService,
  ],
})
export class QuestionnaireModule {}
