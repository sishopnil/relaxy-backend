import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { QuestionnaireAnswerDto } from '../questionnaire-answer.dto';

export class CreateQuestionnaireAnswerDto extends QuestionnaireAnswerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Questionnaire ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Questionnaire ID' })
  questionnaireId: string;
}
