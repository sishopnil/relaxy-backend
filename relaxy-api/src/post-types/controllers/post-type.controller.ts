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
import {
  PostTypeDto,
  PostTypeSearchDto,
} from 'src/common/dtos/posts/post-type.dto';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { PostTypeService } from '../services/post-type.service';

@ApiTags('post-types')
@Controller('post-type')
export class PostTypeController {
  constructor(
    private postTypeService: PostTypeService,
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
    const postTypes = this.postTypeService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, postTypes);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'postType list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() postTypeSearchDto: PostTypeSearchDto,
  ): Promise<ResponseDto> {
    const postTypes = this.postTypeService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      postTypeSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'postType list in pagination',
      pagination.page,
      pagination.limit,
      postTypes,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new postType is created',
  })
  @ApiBody({ type: PostTypeDto })
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
    postTypeDto: PostTypeDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(postTypeDto);
    const postType = this.postTypeService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new postType is created',
      postType,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'postType has been updated',
  })
  @ApiBody({ type: PostTypeDto })
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
    postTypeDto: PostTypeDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(postTypeDto);
    const postType = this.postTypeService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'postType has been updated',
      postType,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'postType successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.postTypeService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'postType successfully deleted!',
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
    const postType = this.postTypeService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, postType);
  }
}
