import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeelingEntity } from 'src/common/entities/feeling.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { PostTypeEntity } from 'src/common/entities/post-type.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { TagEntity } from 'src/common/entities/tags.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PostEntity,
      TagEntity,
      PostTypeEntity,
    ]),
  ],
  controllers: [PostController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    PostService,
    PermissionService,
  ],
})
export class PostModule {}
