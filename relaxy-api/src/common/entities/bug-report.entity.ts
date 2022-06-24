import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'BugReportEntity' })
export class BugReportEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.bugReports)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
