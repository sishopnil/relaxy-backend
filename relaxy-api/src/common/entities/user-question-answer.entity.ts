import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { QuestionnaireAnswerEntity } from './questionnaire-answer.entity';
import { QuestionnaireEntity } from './questionnaire.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'UserQuestionAnswerEntity' })
export class UserQuestionAnswerEntity extends CustomBaseEntity {
  @ManyToOne(
    () => QuestionnaireEntity,
    (questionnaireEntity) => questionnaireEntity.userQuestionnaireAnswer,
  )
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: QuestionnaireEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.userQuestionnaireAnswer,
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => QuestionnaireAnswerEntity,
    (questionnaireAnswerEntity) =>
      questionnaireAnswerEntity.userQuestionnaireAnswer,
  )
  @JoinColumn({ name: 'questionnaireAnswer_id' })
  questionnaireAnswer: QuestionnaireAnswerEntity;
}
