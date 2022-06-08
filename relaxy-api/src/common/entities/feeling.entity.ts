import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { RoleNameEnum } from '../enums/role-name.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { MoodEntity } from './mood.entity';

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
}
