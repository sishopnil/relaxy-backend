import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { ActiveStatus } from '../enums/active.enum';

export class CustomBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @VersionColumn()
  version: number;

  @Column({
    type: 'enum',
    name: 'isActive',
    enum: ActiveStatus,
    default: `${ActiveStatus.ACTIVE}`,
  })
  isActive: ActiveStatus;

  @Column({ type: 'uuid', name: 'createdBy', nullable: true })
  createdBy: string | null;

  @Column({ type: 'uuid', name: 'updatedBy', nullable: true })
  updatedBy: string | null;

  @Column({
    name: 'createAt',
    nullable: true,
  })
  createAt: Date | null;

  @Column({
    name: 'updatedAt',
    nullable: true,
  })
  updatedAt: Date | null;
}
