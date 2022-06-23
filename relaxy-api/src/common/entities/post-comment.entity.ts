import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { PostCommentReactEntity } from './post-comment-react.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'PostCommentEntity' })
export class PostCommentEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 150 })
  description: string;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.postComments)
  @JoinColumn({ name: 'story_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.postComments)
  @JoinColumn({ name: 'user_id' })
  commentBy: UserEntity;

  @OneToMany(
    () => PostCommentReactEntity,
    (postCommentReactEntity) => postCommentReactEntity.postComment,
  )
  postCommentReacts: PostCommentReactEntity[];
}
