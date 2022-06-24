import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'PostReportEntity' })
export class PostReportEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.postReports)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.postReports)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
