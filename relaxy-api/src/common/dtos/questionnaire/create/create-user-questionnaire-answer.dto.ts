import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserQuestionnaireAnsweDto } from '../user-questionnaire-answer.dto';

export class CreateUserQuestionnaireAnswerDto extends UserQuestionnaireAnsweDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Questionnaire ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Questionnaire ID' })
  questionnaireId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Questionnaire ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Questionnaire ID' })
  questionAnswerId: string;
}
