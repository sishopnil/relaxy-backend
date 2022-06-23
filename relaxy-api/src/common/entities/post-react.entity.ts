import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { PostEntity } from './post.entity';
import { ReactEntity } from './react.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'PostReactEntity' })
export class PostReactEntity extends CustomBaseEntity {
  @ManyToOne(() => PostEntity, (postEntity) => postEntity.postReacts)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => ReactEntity, (reactEntity) => reactEntity.postReacts)
  @JoinColumn({ name: 'react_id' })
  react: ReactEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.postReacts)
  @JoinColumn({ name: 'user_id' })
  reactedBy: UserEntity;
}
