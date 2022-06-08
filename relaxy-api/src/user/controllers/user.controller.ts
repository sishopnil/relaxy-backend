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
  AuthWithRoles,
  AuthUser,
} from 'src/common/decorators/auth-guard.decorator';
import { UserResponseDto } from 'src/common/dtos/reponse/user-response.dto';
import { UserDto, UserSearchDto } from 'src/common/dtos/user/user.dto';
import {
  SUPERADMIN_ADMIN,
  SUPERADMIN_ADMIN_EDITOR,
} from 'src/common/enums/role-name.enum';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { UserService } from '../services/user.service';

@ApiTags('users')
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
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  findAll(): Promise<ResponseDto> {
    const users = this.userService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, users);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Users list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() userSearchDto: UserSearchDto,
  ): Promise<ResponseDto> {
    const users = this.userService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      userSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'User list in pagination',
      pagination.page,
      pagination.limit,
      users,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new user is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: UserDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    userDto: UserDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(userDto);
    const user = this.userService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new user is created',
      user,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'User has been updated',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN_EDITOR])
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@AuthUser() authUser: UserResponseDto): Promise<ResponseDto> {
    const me = this.userService.findById(authUser.id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, me);
  }

  @ApiOkResponse({
    description: 'User has been updated',
  })
  @ApiBody({ type: UserDto })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN_EDITOR])
  @Put('me')
  profileUpdate(
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    userDto: UserDto,
    @AuthUser() authUser: UserResponseDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(userDto);
    if (!!userDto.roleName) delete userDto.roleName;
    const user = this.userService.update(authUser.id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Own Profile has been updated',
      user,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'User has been updated',
  })
  @ApiBody({ type: UserDto })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  update(
    @Param('id', new UuidValidationPipe()) id: string,
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    userDto: UserDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(userDto);
    const user = this.userService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'User has been updated',
      user,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.userService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'User successfully deleted!',
      deleted,
    );
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const user = this.userService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, user);
  }
}
