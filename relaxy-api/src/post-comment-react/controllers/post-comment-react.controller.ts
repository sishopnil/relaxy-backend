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
import { CreatePostCommentReactDto } from 'src/common/dtos/posts/create/create-post-comment-react.dto';
import { CreatePostReactDto } from 'src/common/dtos/posts/create/create-post-react.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { PostCommentReactService } from '../services/post-comment-react.service';

@ApiTags('post-comment-reacts')
@Controller('post-comment-react')
export class PostCommentReactController {
  constructor(
    private postReactService: PostCommentReactService,
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
    const reacts = this.postReactService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, reacts);
  }

  @ApiCreatedResponse({
    description: 'A new react is created',
  })
  @ApiBody({ type: CreatePostCommentReactDto })
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
    createPostCommentReactDto: CreatePostCommentReactDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(
      createPostCommentReactDto,
    );
    const react = this.postReactService.create(modifiedDto);
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
  @ApiBody({ type: CreatePostCommentReactDto })
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
    createPostCommentReactDto: CreatePostCommentReactDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(
      createPostCommentReactDto,
    );
    const react = this.postReactService.update(id, modifiedDto);
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
    const deleted = this.postReactService.remove(id);
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
    const react = this.postReactService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, react);
  }
}
