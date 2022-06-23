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
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { DoctorSessionTypeDto, DoctorSessionTypeSearchDto } from 'src/common/dtos/doctor-session/doctor-session-type.dto';
import { ServiceDto, ServiceSearchDto } from 'src/common/dtos/doctor-session/service.dto';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { DoctorSessionTypeService } from '../services/doctor-session-type.service';

@ApiTags('doctor-session-types')
@Controller('doctor-session-type')
export class DoctorSessionTypeController {
  constructor(
    private doctorSessionTypeService: DoctorSessionTypeService,
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
    const doctorSessionType = this.doctorSessionTypeService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, doctorSessionType);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Session Type list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() doctorSessionTypeSearchDto: DoctorSessionTypeSearchDto,
  ): Promise<ResponseDto> {
    const doctorSessionTypes = this.doctorSessionTypeService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      doctorSessionTypeSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Session Type list in pagination',
      pagination.page,
      pagination.limit,
      doctorSessionTypes,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new session Type is created',
  })
  @ApiBody({ type: DoctorSessionTypeDto })
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
    doctorSessionTypeDto: DoctorSessionTypeDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(doctorSessionTypeDto);
    const doctorSessionType = this.doctorSessionTypeService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new session Type is created',
      doctorSessionType,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Session Type has been updated',
  })
  @ApiBody({ type: DoctorSessionTypeDto })
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
    doctorSessionTypeDto: DoctorSessionTypeDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(doctorSessionTypeDto);
    const doctorSessionType = this.doctorSessionTypeService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Session Type has been updated',
      doctorSessionType,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Session Type successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.doctorSessionTypeService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Session Type successfully deleted!',
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
    const doctorSessionType = this.doctorSessionTypeService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, doctorSessionType);
  }
}
