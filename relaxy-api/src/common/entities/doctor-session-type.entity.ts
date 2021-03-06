import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';

@Entity({ name: 'DoctorSessionTypeEntity' })
export class DoctorSessionTypeEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'title', length: 65 })
  title: string;

  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @Column({ type: 'varchar', name: 'icon', length: 65 })
  icon: string;
}
