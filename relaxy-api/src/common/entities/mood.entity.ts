import { Column, Entity, OneToMany } from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { FeelingEntity } from './feeling.entity';
import { StoryEntity } from './story.entity';

@Entity({ name: 'MoodEntity' })
export class MoodEntity extends CustomBaseEntity {
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

  @OneToMany(() => FeelingEntity, (feelingEntity) => feelingEntity.mood)
  feelings: FeelingEntity[];

  @OneToMany(() => StoryEntity, (storyEntity) => storyEntity.mood)
  stories: StoryEntity[];
}
