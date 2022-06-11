import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeelingEntity } from 'src/common/entities/feeling.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { PermissionService } from 'src/common/services/permission.service';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { StoryController } from './controllers/story.controller';
import { StoryService } from './services/story.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoryEntity,
      MoodEntity,
      FeelingEntity,
      UserEntity,
    ]),
  ],
  controllers: [StoryController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    StoryService,
    PermissionService,
  ],
})
export class StoryModule {}
