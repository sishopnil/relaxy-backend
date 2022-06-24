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
import { CreatePostReportDto } from 'src/common/dtos/reports/create/create-post-report.dto';
import { PostReportSearchDto } from 'src/common/dtos/reports/post-report.dto';
import { MoodDto, MoodSearchDto } from 'src/common/dtos/story/mood.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { PostReportService } from '../services/post-report.service';

@ApiTags('post-reports')
@Controller('post-report')
export class PostReportController {
  constructor(
    private postReportService: PostReportService,
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
    const moods = this.postReportService.findAll();
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
    @Query() postReportSearchDto: PostReportSearchDto,
  ): Promise<ResponseDto> {
    const moods = this.postReportService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      postReportSearchDto,
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
  @ApiBody({ type: CreatePostReportDto })
  @HttpCode(HttpStatus.CREATED)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createPostReportDto: CreatePostReportDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createPostReportDto);
    const mood = this.postReportService.create(modifiedDto);
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
  @ApiBody({ type: CreatePostReportDto })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
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
    createPostReportDto: CreatePostReportDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createPostReportDto);
    const mood = this.postReportService.update(id, modifiedDto);
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
    const deleted = this.postReportService.remove(id);
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
    const mood = this.postReportService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, mood);
  }
}
