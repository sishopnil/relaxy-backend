import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactEntity } from 'src/common/entities/react.entity';
import { StoryReactEntity } from 'src/common/entities/story-react.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { StoryReactController } from './controllers/story-react.controller';
import { StoryReactService } from './services/story-react.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReactEntity,StoryReactEntity,StoryEntity,UserEntity])],
  controllers: [StoryReactController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    StoryReactService,
    PermissionService
  ],
})
export class StoryReactModule {}
