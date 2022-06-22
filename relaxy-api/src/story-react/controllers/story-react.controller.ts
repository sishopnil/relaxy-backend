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
import { CreateStoryReactDto } from 'src/common/dtos/story/create/create-story-react.dto';
import { CreateStoryDto } from 'src/common/dtos/story/create/create-story.dto';
import { ReactDto, ReactSearchDto } from 'src/common/dtos/story/react.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { StoryReactService } from '../services/story-react.service';

@ApiTags('story-reacts')
@Controller('story-react')
export class StoryReactController {
  constructor(
    private storyReactService: StoryReactService,
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
    const reacts = this.storyReactService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, reacts);
  }

  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'React list in pagination',
  // })
  // @HttpCode(HttpStatus.OK)
  // @Get('pagination')
  // pagination(
  //   @PaginationDecorator() pagination: PaginationDTO,
  //   @Query() reactSearchDto: ReactSearchDto,
  // ): Promise<ResponseDto> {
  //   const reacts = this.storyReactService.pagination(
  //     pagination.page,
  //     pagination.limit,
  //     pagination.sort as 'DESC' | 'ASC',
  //     pagination.order,
  //     reactSearchDto,
  //   );
  //   return this.responseService.toPaginationResponse(
  //     HttpStatus.OK,
  //     'React list in pagination',
  //     pagination.page,
  //     pagination.limit,
  //     reacts,
  //   );
  // }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new react is created',
  })
  @ApiBody({ type: CreateStoryReactDto })
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
    createStoryReactDto: CreateStoryReactDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createStoryReactDto);
    const react = this.storyReactService.create(modifiedDto);
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
  @ApiBody({ type: CreateStoryReactDto })
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
    createStoryReactDto: CreateStoryReactDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createStoryReactDto);
    const react = this.storyReactService.update(id, modifiedDto);
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
    const deleted = this.storyReactService.remove(id);
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
    const react = this.storyReactService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, react);
  }
}
