import { Column, Entity, OneToMany } from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { QuestionnaireAnswerEntity } from './questionnaire-answer.entity';

@Entity({ name: 'QuestionnaireEntity' })
export class QuestionnaireEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'title', length: 65 })
  title: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: ActiveStatus,
    default: `${ActiveStatus.ACTIVE}`,
  })
  status: ActiveStatus;

  @OneToMany(
    () => QuestionnaireAnswerEntity,
    (questionnaireAnswerEntity) => questionnaireAnswerEntity.questionnaire,
  )
  questionnaireAnswer: QuestionnaireAnswerEntity[];
}
