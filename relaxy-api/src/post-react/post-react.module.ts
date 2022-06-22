import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { PostReactController } from './controllers/post-react.controller';
import { PostReactService } from './services/post-react.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReactEntity,
      PostReactEntity,
      PostEntity,
      UserEntity,
    ]),
  ],
  controllers: [PostReactController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    PostReactService,
    PermissionService,
  ],
})
export class PostReactModule {}
