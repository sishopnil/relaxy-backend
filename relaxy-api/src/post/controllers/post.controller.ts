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
import { CreatePostDto } from 'src/common/dtos/posts/create/create-post.dto';
import { PostSearchDto } from 'src/common/dtos/posts/post.dto';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { PostService } from '../services/post.service';

@ApiTags('posts')
@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
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
    const posts = this.postService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, posts);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Post list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() postSearchDto: PostSearchDto,
  ): Promise<ResponseDto> {
    const stories = this.postService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      postSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Post list in pagination',
      pagination.page,
      pagination.limit,
      stories,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new post is created',
  })
  @ApiBody({ type: CreatePostDto })
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
    createPostDto: CreatePostDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createPostDto);
    const stories = this.postService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new post is created',
      stories,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Post has been updated',
  })
  @ApiBody({ type: CreatePostDto })
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
    createPostDto: CreatePostDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createPostDto);
    const post = this.postService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Post has been updated',
      post,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Post successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.postService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Post successfully deleted!',
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
    const post = this.postService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, post);
  }
}
