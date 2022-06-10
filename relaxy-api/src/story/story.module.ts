import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { StoryService } from './services/story.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryEntity])],
  controllers: [StoryEntity],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    StoryService,
  ],
})
export class StoryModule {}
