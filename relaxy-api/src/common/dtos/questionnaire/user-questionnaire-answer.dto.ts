import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { QuestionnaireAnswerDto } from './questionnaire-answer.dto';
import { QuestionnaireDto } from './questionnaire.dto';

export class UserQuestionnaireAnsweDto extends BaseDto {
  @Type(() => QuestionnaireDto)
  questionnaire: QuestionnaireDto;

  @Type(() => UserDto)
  user: UserDto;

  @Type(() => QuestionnaireAnswerDto)
  questionnaireAnswer: QuestionnaireAnswerDto;
}
