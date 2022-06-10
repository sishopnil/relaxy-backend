import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { RoleNameEnum } from '../enums/role-name.enum';
import { CustomBaseEntity } from './custom-base.entity';
import { StoryEntity } from './story.entity';

@Entity({ name: 'UserEntity' })
export class UserEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({ type: 'varchar', name: 'email', length: 100, nullable: true })
  @Index({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: 100,
    nullable: true,
    // select: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleNameEnum,
    name: 'roleName',
    default: `${RoleNameEnum.SUPER_ADMIN_ROLE}`,
  })
  roleName: RoleNameEnum;

  @OneToMany(() => StoryEntity, (storyEntity) => storyEntity.user)
  stories: StoryEntity[];
}
