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
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth-guard.decorator';
import { CreatePostCommentDto } from 'src/common/dtos/posts/create/create-post-comment.dto';
import { CreateStoryCommentDto } from 'src/common/dtos/story/create/create-story-comment.dto copy';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { PostCommentService } from '../services/post-comment.service';

@ApiTags('post-comments')
@Controller('post-comment')
export class PostCommentController {
  constructor(
    private postCommentService: PostCommentService,
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
    const reacts = this.postCommentService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, reacts);
  }

  @ApiCreatedResponse({
    description: 'A new react is created',
  })
  @ApiBody({ type: CreatePostCommentDto })
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
    createPostCommentDto: CreatePostCommentDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createPostCommentDto);
    const react = this.postCommentService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new react is created',
      react,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'React has been updated',
  })
  @ApiBody({ type: CreatePostCommentDto })
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
    createPostCommentDto: CreatePostCommentDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createPostCommentDto);
    const react = this.postCommentService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'React has been updated',
      react,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'React successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.postCommentService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'React successfully deleted!',
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
    const react = this.postCommentService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, react);
  }
}
