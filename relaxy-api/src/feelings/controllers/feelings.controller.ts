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
import { CreateFeelingsDto } from 'src/common/dtos/story/create/create-feelings.dto';
import { FeelingsSearchDto } from 'src/common/dtos/story/feeling.dto';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { FeelingsService } from '../services/feelings.service';

@ApiTags('feelings')
@Controller('feeling')
export class FeelingsController {
  constructor(
    private feelingsService: FeelingsService,
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
    const feelings = this.feelingsService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, feelings);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Feelings list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() feelingsSearchDto: FeelingsSearchDto,
  ): Promise<ResponseDto> {
    const feelings = this.feelingsService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      feelingsSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Feelings list in pagination',
      pagination.page,
      pagination.limit,
      feelings,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new feeling is created',
  })
  @ApiBody({ type: CreateFeelingsDto })
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
    createFeelingsDto: CreateFeelingsDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createFeelingsDto);
    const feeling = this.feelingsService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new feeling is created',
      feeling,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Feeling has been updated',
  })
  @ApiBody({ type: CreateFeelingsDto })
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
    createFeelingsDto: CreateFeelingsDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createFeelingsDto);
    const feeling = this.feelingsService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Feeling has been updated',
      feeling,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Feeling successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.feelingsService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Feeling successfully deleted!',
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
    const feeling = this.feelingsService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, feeling);
  }
}
