import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { ReactEntity } from './react.entity';
import { StoryEntity } from './story.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'StoryReactEntity' })
export class StoryReactEntity extends CustomBaseEntity {
  @ManyToOne(() => StoryEntity, (storyEntity) => storyEntity.storyReacts)
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;

  @ManyToOne(() => ReactEntity, (reactEntity) => reactEntity.storyReacts)
  @JoinColumn({ name: 'react_id' })
  react: ReactEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.storyReacts)
  @JoinColumn({ name: 'user_id' })
  reactedBy: UserEntity;
}
