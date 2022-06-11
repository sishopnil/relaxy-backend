import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { FeelingEntity } from './feeling.entity';
import { MoodEntity } from './mood.entity';
import { PostTypeEntity } from './post-type.entity';
import { TagEntity } from './tags.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'PostEntity' })
export class PostEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 150 })
  description: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostTypeEntity, (postTypeEntity) => postTypeEntity.posts)
  @JoinColumn({ name: 'post_type_id' })
  postType: PostTypeEntity;

  @ManyToMany(() => TagEntity, (tagEntity) => tagEntity.posts)
  @JoinTable({
    name: 'PostHasTag',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];
}
