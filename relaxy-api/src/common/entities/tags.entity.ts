import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'TagEntity' })
export class TagEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'title', length: 150 })
  title: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: ActiveStatus,
    default: `${ActiveStatus.ACTIVE}`,
  })
  status: ActiveStatus;

  @ManyToMany(() => UserEntity, (userEntity) => userEntity.tags)
  @JoinTable({
    name: 'UserHasTag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  @ManyToMany(() => PostEntity, (postEntity) => postEntity.tags)
  posts: PostEntity[];
}
