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
import {
  BugReportDto,
  BugReportSearchDto,
} from 'src/common/dtos/reports/bug-report.dto';
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
import { BugReportService } from '../services/bug-report.service';

@ApiTags('bug-reports')
@Controller('bug-report')
export class BugReportController {
  constructor(
    private bugReportService: BugReportService,
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
    const moods = this.bugReportService.findAll();
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
    @Query() postReportSearchDto: BugReportSearchDto,
  ): Promise<ResponseDto> {
    const moods = this.bugReportService.pagination(
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
  @ApiBody({ type: BugReportDto })
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
    bugReportDto: BugReportDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(bugReportDto);
    const mood = this.bugReportService.create(modifiedDto);
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
  @ApiBody({ type: BugReportDto })
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
    bugReportDto: BugReportDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(bugReportDto);
    const mood = this.bugReportService.update(id, modifiedDto);
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
    const deleted = this.bugReportService.remove(id);
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
    const mood = this.bugReportService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, mood);
  }
}
