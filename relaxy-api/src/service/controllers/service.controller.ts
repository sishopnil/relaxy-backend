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
import { ServiceDto, ServiceSearchDto } from 'src/common/dtos/doctor-session/service.dto';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { ServiceService } from '../services/service.service';

@ApiTags('services')
@Controller('service')
export class ServiceController {
  constructor(
    private serviceService: ServiceService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {
    this.findAll();
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<ResponseDto> {
    const services = this.serviceService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, services);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Service list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() serviceSearchDto: ServiceSearchDto,
  ): Promise<ResponseDto> {
    const services = this.serviceService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      serviceSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Service list in pagination',
      pagination.page,
      pagination.limit,
      services,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new service is created',
  })
  @ApiBody({ type: ServiceDto })
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
    serviceDto: ServiceDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(serviceDto);
    const service = this.serviceService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new service is created',
      service,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Service has been updated',
  })
  @ApiBody({ type: ServiceDto })
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
    serviceDto: ServiceDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(serviceDto);
    const service = this.serviceService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Service has been updated',
      service,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Services successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.serviceService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Services successfully deleted!',
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
    const service = this.serviceService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, service);
  }
}
