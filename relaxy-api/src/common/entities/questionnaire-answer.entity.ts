import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { QuestionnaireEntity } from './questionnaire.entity';
import { UserQuestionAnswerEntity } from './user-question-answer.entity';

@Entity({ name: 'QuestionnaireAnswerEntity' })
export class QuestionnaireAnswerEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'option', length: 150 })
  option: string;

  @Column({
    type: 'integer',
    name: 'point',
    default: () => "'1'",
    nullable: false,
  })
  point: number;

  @ManyToOne(
    () => QuestionnaireEntity,
    (questionnaireEntity) => questionnaireEntity.questionnaireAnswer,
  )
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: QuestionnaireEntity;

  @OneToMany(
    () => UserQuestionAnswerEntity,
    (userQuestionAnswerEntity) => userQuestionAnswerEntity.questionnaireAnswer,
  )
  userQuestionnaireAnswer: UserQuestionAnswerEntity[];
}
