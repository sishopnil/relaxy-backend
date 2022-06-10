import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth-guard.decorator';
import { CreateStoryDto } from 'src/common/dtos/story/create/create-story.dto';
import { MoodDto, MoodSearchDto } from 'src/common/dtos/story/mood.dto';
import { StorySearchDto } from 'src/common/dtos/story/story.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { StoryService } from '../services/story.service';

@ApiTags('moods')
@Controller('mood')
export class StoryController {
  constructor(
    private storyService: StoryService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {
    this.findAll();
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<ResponseDto> {
    const moods = this.storyService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, moods);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Mood list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() storySearchDto: StorySearchDto,
  ): Promise<ResponseDto> {
    const moods = this.storyService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      storySearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Mood list in pagination',
      pagination.page,
      pagination.limit,
      moods,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new mood is created',
  })
  @ApiBody({ type: CreateStoryDto })
  @HttpCode(HttpStatus.CREATED)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    moodDto: CreateStoryDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(moodDto);
    const mood = this.storyService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new mood is created',
      mood,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Mood has been updated',
  })
  @ApiBody({ type: CreateStoryDto })
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('id', new UuidValidationPipe()) id: string,
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    moodDto: CreateStoryDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(moodDto);
    const mood = this.storyService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Mood has been updated',
      mood,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Mood successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.storyService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Mood successfully deleted!',
      deleted,
    );
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const mood = this.storyService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, mood);
  }
}
