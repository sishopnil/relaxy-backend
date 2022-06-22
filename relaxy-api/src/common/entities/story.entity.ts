import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { FeelingEntity } from './feeling.entity';
import { MoodEntity } from './mood.entity';
import { StoryReactEntity } from './story-react.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'StoryEntity' })
export class StoryEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 150 })
  description: string;

  @Column({
    name: 'expireDate',
    nullable: true,
  })
  expireDate: Date | null;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.stories)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => MoodEntity, (moodEntity) => moodEntity.stories)
  @JoinColumn({ name: 'mood_id' })
  mood: MoodEntity;

  @ManyToOne(() => FeelingEntity, (feelingEntity) => feelingEntity.stories)
  @JoinColumn({ name: 'feeling_id' })
  feeling: FeelingEntity;

  @OneToMany(() => StoryReactEntity, (storyReactEntity) => storyReactEntity.story)
  storyReacts: StoryReactEntity[];
}
