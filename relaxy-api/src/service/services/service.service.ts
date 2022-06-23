import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDto, ServiceSearchDto } from 'src/common/dtos/doctor-session/service.dto';
import { ServiceEntity } from 'src/common/entities/service.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class ServiceService {
  private redis = {};
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<ServiceDto[]> {
    try {
      const allServices = await this.serviceRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<ServiceEntity, ServiceDto>(allServices);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    serviceSearchDto: ServiceSearchDto,
  ): Promise<[ServiceDto[], number]> {
    try {
      const query = await this.serviceRepository.createQueryBuilder('services');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (serviceSearchDto.title && serviceSearchDto.title.length > 0) {
        query.andWhere('lower(services.title) like :title', {
          title: `%${serviceSearchDto.title.toLowerCase()}%`,
        });
      }

      if (serviceSearchDto.description && serviceSearchDto.description.length > 0) {
        query.andWhere('lower(services.description) like :description', {
          description: `%${serviceSearchDto.description.toLowerCase()}%`,
        });
      }

      if (serviceSearchDto.status && serviceSearchDto.status.length > 0) {
        query.andWhere('lower(services.status) like :status', {
          status: `%${serviceSearchDto.status.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title','description', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`services.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allServices, count] = await query.getManyAndCount();

      const services = await this.conversionService.toDtos<ServiceEntity, ServiceDto>(
        allServices,
      );

      return [services, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: ServiceDto): Promise<ServiceDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        ServiceEntity,
        ServiceDto
      >(dto);

      const service = this.serviceRepository.create(dtoToEntity);
      await this.serviceRepository.save(service);
      return this.conversionService.toDto<ServiceEntity, ServiceDto>(service);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: ServiceDto): Promise<ServiceDto> {
    try {
      const saveDto = await this.getServiceById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        ServiceEntity,
        ServiceDto
      >({ ...saveDto, ...dto });

      const updatedService = await this.serviceRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<ServiceEntity, ServiceDto>(updatedService);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getServiceById(id);

      const deleted = await this.serviceRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<ServiceDto> {
    try {
      const service = await this.getServiceById(id);
      return this.conversionService.toDto<ServiceEntity, ServiceDto>(service);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getServiceById(id: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(service, 'Service Not Found!!');
    return service;
  }
  /*********************** End checking relations of post *********************/
}
