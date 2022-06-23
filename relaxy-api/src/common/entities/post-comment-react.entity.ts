import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { PostCommentEntity } from './post-comment.entity';
import { ReactEntity } from './react.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'PostCommentReactEntity' })
export class PostCommentReactEntity extends CustomBaseEntity {
  @ManyToOne(
    () => PostCommentEntity,
    (postCommentEntity) => postCommentEntity.postCommentReacts,
  )
  @JoinColumn({ name: 'postComment_id' })
  postComment: PostCommentEntity;

  @ManyToOne(() => ReactEntity, (reactEntity) => reactEntity.postCommentReacts)
  @JoinColumn({ name: 'react_id' })
  react: ReactEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.postCommentReacts)
  @JoinColumn({ name: 'user_id' })
  reactedBy: UserEntity;
}
