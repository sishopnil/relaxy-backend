import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './custom-base.entity';

@Entity({ name: 'UserEntity' })
export class UserEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;
}
