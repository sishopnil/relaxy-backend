import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { MoodEntity } from './mood.entity';
import { StoryEntity } from './story.entity';

@Entity({ name: 'FeelingEntity' })
export class FeelingEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'title', length: 65 })
  title: string;

  @Column({ type: 'varchar', name: 'icon', length: 65 })
  icon: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: ActiveStatus,
    default: `${ActiveStatus.ACTIVE}`,
  })
  status: ActiveStatus;

  @ManyToOne(() => MoodEntity, (moodEntity) => moodEntity.feelings)
  @JoinColumn({ name: 'mood_id' })
  mood: MoodEntity;

  @OneToMany(() => StoryEntity, (storyEntity) => storyEntity.feeling)
  stories: StoryEntity[];
}
