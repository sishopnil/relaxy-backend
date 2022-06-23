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
import { CreateDoctorDto } from 'src/common/dtos/doctor-session/create/create-doctor.dto';
import { DoctorSearchDto } from 'src/common/dtos/doctor-session/doctor.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { DoctorService } from '../services/doctor.service';

@ApiTags('doctors')
@Controller('doctor')
export class DoctorController {
  constructor(
    private doctorService: DoctorService,
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
    const doctors = this.doctorService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, doctors);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Doctor list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() doctorSearchDto: DoctorSearchDto,
  ): Promise<ResponseDto> {
    const doctors = this.doctorService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      doctorSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Doctor list in pagination',
      pagination.page,
      pagination.limit,
      doctors,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new doctor is created',
  })
  @ApiBody({ type: CreateDoctorDto })
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
    createDoctorDto: CreateDoctorDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createDoctorDto);
    const doctor = this.doctorService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new doctor is created',
      doctor,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Doctor has been updated',
  })
  @ApiBody({ type: CreateDoctorDto })
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
    createDoctorDto: CreateDoctorDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createDoctorDto);
    const doctor = this.doctorService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Doctor has been updated',
      doctor,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Doctor successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.doctorService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Doctor successfully deleted!',
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
    const doctor = this.doctorService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, doctor);
  }
}
