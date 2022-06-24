import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { RoleNameEnum } from '../enums/role-name.enum';
import { BugReportEntity } from './bug-report.entity';
import { CustomBaseEntity } from './custom-base.entity';
import { DoctorEntity } from './doctor.entity';
import { PostCommentReactEntity } from './post-comment-react.entity';
import { PostCommentEntity } from './post-comment.entity';
import { PostReactEntity } from './post-react.entity';
import { PostReportEntity } from './post-report.entity';
import { PostEntity } from './post.entity';
import { StoryCommentEntity } from './story-comment.entity';
import { StoryReactEntity } from './story-react.entity';
import { StoryEntity } from './story.entity';
import { TagEntity } from './tags.entity';
import { UserQuestionAnswerEntity } from './user-question-answer.entity';

@Entity({ name: 'UserEntity' })
export class UserEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({ type: 'varchar', name: 'email', length: 100, nullable: true })
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

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts: PostEntity[];

  @ManyToMany(() => TagEntity, (tagEntity) => tagEntity.users)
  tags: TagEntity[];

  @OneToMany(
    () => StoryReactEntity,
    (storyReactEntity) => storyReactEntity.reactedBy,
  )
  storyReacts: StoryReactEntity[];

  @OneToMany(
    () => StoryCommentEntity,
    (storyReactEntity) => storyReactEntity.commentBy,
  )
  storyComments: StoryCommentEntity[];

  @OneToMany(
    () => PostReactEntity,
    (postReactEntity) => postReactEntity.reactedBy,
  )
  postReacts: PostReactEntity[];

  @OneToMany(
    () => PostCommentEntity,
    (postCommentEntity) => postCommentEntity.commentBy,
  )
  postComments: PostCommentEntity[];

  @OneToMany(
    () => PostCommentReactEntity,
    (postCommentReactEntity) => postCommentReactEntity.reactedBy,
  )
  postCommentReacts: PostCommentReactEntity[];

  @OneToOne(() => DoctorEntity, (doctorEntity) => doctorEntity.user)
  doctor: DoctorEntity;

  @OneToMany(
    () => PostReportEntity,
    (postReportEntity) => postReportEntity.user,
  )
  postReports: PostReportEntity[];

  @OneToMany(() => BugReportEntity, (bugReportEntity) => bugReportEntity.user)
  bugReports: BugReportEntity[];

  @OneToMany(
    () => UserQuestionAnswerEntity,
    (userQuestionAnswerEntity) => userQuestionAnswerEntity.user,
  )
  userQuestionnaireAnswer: UserQuestionAnswerEntity[];
}
