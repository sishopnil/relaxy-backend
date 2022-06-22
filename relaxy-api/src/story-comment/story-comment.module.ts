import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryCommentEntity } from 'src/common/entities/story-comment.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { StoryCommentController } from './controllers/story-comment.controller';
import { StoryCommentService } from './services/story-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryCommentEntity, UserEntity, StoryEntity]),
  ],
  controllers: [StoryCommentController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    StoryCommentService,
    PermissionService,
  ],
})
export class StoryCommentModule {}
