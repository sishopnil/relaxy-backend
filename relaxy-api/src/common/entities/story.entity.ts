import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';

@Entity({ name: 'StoryEntity' })
export class StoryEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;
}
