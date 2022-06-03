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
import { UserDto } from 'src/common/dtos/user/user.dto';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { SUPERADMIN_ADMIN_EDITOR } from '../../common/enums/role-name.enum';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
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
    const tvcs = this.userService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, tvcs);
  }

  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'Article Category list in pagination',
  // })
  // @HttpCode(HttpStatus.OK)
  // @Get('pagination')
  // pagination(
  //   @PaginationDecorator() pagination: PaginationDTO,
  //   @Query() articleCategorySearchDto: ArticleCategorySearchDto,
  // ): Promise<ResponseDto> {
  //   const tvcs = this.userService.pagination(
  //     pagination.page,
  //     pagination.limit,
  //     pagination.sort as 'DESC' | 'ASC',
  //     pagination.order,
  //     articleCategorySearchDto,
  //   );
  //   return this.responseService.toPaginationResponse(
  //     HttpStatus.OK,
  //     'Article Category list in pagination',
  //     pagination.page,
  //     pagination.limit,
  //     tvcs,
  //   );
  // }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new Article Category is created',
  })
  @ApiBody({ type: UserDto })
  @HttpCode(HttpStatus.CREATED)
  // @AuthWithRoles([...SUPERADMIN_ADMIN_EDITOR])
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    ArticleCategoryDto: UserDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(ArticleCategoryDto);
    const tvc = this.userService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new Article Category is created',
      tvc,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Article Category has been updated',
  })
  @ApiBody({ type: UserDto })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN_EDITOR])
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
    ArticleCategoryDto: UserDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(ArticleCategoryDto);
    const tvc = this.userService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Article Category has been updated',
      tvc,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Article Category successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN_EDITOR])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.userService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Article Category successfully deleted!',
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
    const tvc = this.userService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, tvc);
  }
}
