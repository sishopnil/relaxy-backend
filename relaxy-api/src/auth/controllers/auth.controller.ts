import { ResponseDto } from './../../common/dtos/reponse/response.dto';
import { UserDto } from './../../common/dtos/user/user.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../common/dtos/user/create/login.dto';
import { AuthService } from '../services/auth.service';
import { DtoValidationPipe } from './../../common/pipes/dto-validation.pipe';
import { ResponseService } from './../../common/services/response.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiBody({ type: UserDto })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Registration Successfully Completed',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('registration')
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  create(
    @Body(
      new DtoValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    usersDto: UserDto,
  ): Promise<ResponseDto> {
    const userDto = this.authService.create(usersDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Registration Successfully Completed',
      userDto,
    );
  }

  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Login is successful',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    loginDto: LoginDto,
  ): Promise<ResponseDto> {
    const payload = this.authService.login(loginDto);
    return await this.responseService.toDtoResponse<any>(
      HttpStatus.OK,
      'Login is successful',
      payload,
    );
  }
}
