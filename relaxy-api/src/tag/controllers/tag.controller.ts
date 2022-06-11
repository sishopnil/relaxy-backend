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
import { TagDto, TagSearchDto } from 'src/common/dtos/posts/tags.dto';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { TagService } from '../services/tag.service';

@ApiTags('tags')
@Controller('tag')
export class TagController {
  constructor(
    private tagService: TagService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {}

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<ResponseDto> {
    const moods = this.tagService.findAll();
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
    @Query() tagSearchDto: TagSearchDto,
  ): Promise<ResponseDto> {
    const moods = this.tagService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      tagSearchDto,
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
  @ApiBody({ type: TagDto })
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
    tagDto: TagDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(tagDto);
    const mood = this.tagService.create(modifiedDto);
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
  @ApiBody({ type: TagDto })
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
    tagDto: TagDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(tagDto);
    const mood = this.tagService.update(id, modifiedDto);
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
    const deleted = this.tagService.remove(id);
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
    const mood = this.tagService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, mood);
  }
}
