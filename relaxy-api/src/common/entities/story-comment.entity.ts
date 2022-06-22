import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { StoryEntity } from './story.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'StoryCommentEntity' })
export class StoryCommentEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 150 })
  description: string;

  @ManyToOne(() => StoryEntity, (storyEntity) => storyEntity.storyComments)
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.storyComments)
  @JoinColumn({ name: 'user_id' })
  commentBy: UserEntity;
}
