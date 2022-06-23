import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';
import { ServiceEntity } from './service.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'DoctorEntity' })
export class DoctorEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.doctor)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => ServiceEntity, (serviceEntity) => serviceEntity.doctors)
  @JoinTable({
    name: 'DoctorHasServices',
    joinColumn: {
      name: 'doctor_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
  })
  services: ServiceEntity[];
}
