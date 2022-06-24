import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { QuestionnaireAnswerEntity } from 'src/common/entities/questionnaire-answer.entity';
import { QuestionnaireEntity } from 'src/common/entities/questionnaire.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { QuestionnaireAnswerController } from './controllers/questionnaire-anser.controller';
import { QuestionnaireAnswerService } from './services/questionnaire-answer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionnaireAnswerEntity, QuestionnaireEntity]),
  ],
  controllers: [QuestionnaireAnswerController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    QuestionnaireAnswerService,
  ],
})
export class QuestionnaireAnswerModule {}
