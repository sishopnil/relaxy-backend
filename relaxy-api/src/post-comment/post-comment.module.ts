import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentEntity } from 'src/common/entities/post-comment.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { PostCommentController } from './controllers/post-comment.controller';
import { PostCommentService } from './services/post-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostCommentEntity, UserEntity, PostEntity]),
  ],
  controllers: [PostCommentController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    PostCommentService,
    PermissionService,
  ],
})
export class PostCommentModule {}
