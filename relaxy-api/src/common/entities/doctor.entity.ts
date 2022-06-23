import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';

@Entity({ name: 'DoctorEntity' })
export class DoctorEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;
}
