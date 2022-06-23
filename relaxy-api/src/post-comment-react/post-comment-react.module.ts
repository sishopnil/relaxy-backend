import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentReactEntity } from 'src/common/entities/post-comment-react.entity';
import { PostCommentEntity } from 'src/common/entities/post-comment.entity';
import { PostReactEntity } from 'src/common/entities/post-react.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { ReactEntity } from 'src/common/entities/react.entity';
import { StoryReactEntity } from 'src/common/entities/story-react.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { PostCommentReactController } from './controllers/post-comment-react.controller';
import { PostCommentReactService } from './services/post-comment-react.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReactEntity,
      UserEntity,
      PostCommentReactEntity,
      PostCommentEntity,
    ]),
  ],
  controllers: [PostCommentReactController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    PostCommentReactService,
    PermissionService,
  ],
})
export class PostCommentReactModule {}
