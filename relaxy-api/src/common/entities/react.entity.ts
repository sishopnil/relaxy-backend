import { Column, Entity, OneToMany } from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { StoryReactEntity } from './story-react.entity';

@Entity({ name: 'ReactEntity' })
export class ReactEntity extends CustomBaseEntity {
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

  @OneToMany(() => StoryReactEntity, (storyReactEntity) => storyReactEntity.react)
  storyReacts: StoryReactEntity[];
}
