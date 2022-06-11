import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { PostTypeEntity } from 'src/common/entities/post-type.entity';
import { ConversionService } from '../common/services/conversion.service';
import { ExceptionService } from '../common/services/exception.service';
import { RequestService } from '../common/services/request.service';
import { ResponseService } from '../common/services/response.service';
import { PostTypeController } from './controllers/post-type.controller';
import { PostTypeService } from './services/post-type.service';
@Module({
  imports: [TypeOrmModule.forFeature([PostTypeEntity])],
  controllers: [PostTypeController],
  providers: [
    ConversionService,
    ResponseService,
    ExceptionService,
    RequestService,
    PostTypeService,
  ],
})
export class PostTypeModule {}
