import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { QuestionnaireAnswerEntity } from 'src/common/entities/questionnaire-answer.entity';
import { QuestionnaireEntity } from 'src/common/entities/questionnaire.entity';
import { UserQuestionAnswerEntity } from 'src/common/entities/user-question-answer.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { UserQuestionAnswerController } from './controllers/user-question-answer.controller';
import { UserQuestionAnswerService } from './services/user-question-answer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserQuestionAnswerEntity,
      UserEntity,
      QuestionnaireEntity,
      QuestionnaireAnswerEntity,
    ]),
  ],
  controllers: [UserQuestionAnswerController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    UserQuestionAnswerService,
    PermissionService,
  ],
})
export class UserQuestionAnswerModule {}
