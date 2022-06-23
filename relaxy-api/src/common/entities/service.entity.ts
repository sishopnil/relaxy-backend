import { Column, Entity, ManyToMany } from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { DoctorEntity } from './doctor.entity';

@Entity({ name: 'ServiceEntity' })
export class ServiceEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'title', length: 65 })
  title: string;

  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @Column({ type: 'varchar', name: 'icon', length: 65 })
  icon: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: ActiveStatus,
    default: `${ActiveStatus.ACTIVE}`,
  })
  status: ActiveStatus;

  @ManyToMany(() => DoctorEntity, (doctorEntity) => doctorEntity.services)
  doctors: DoctorEntity[];
}
