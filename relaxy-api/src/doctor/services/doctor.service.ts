import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDoctorDto } from 'src/common/dtos/doctor-session/create/create-doctor.dto';
import {
  DoctorDto,
  DoctorSearchDto,
} from 'src/common/dtos/doctor-session/doctor.dto';
import { DoctorEntity } from 'src/common/entities/doctor.entity';
import { ServiceEntity } from 'src/common/entities/service.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PermissionService } from 'src/common/services/permission.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class DoctorService {
  private redis = {};
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<DoctorDto[]> {
    try {
      const allDoctors = await this.doctorRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<DoctorEntity, DoctorDto>(allDoctors);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    doctorSearchDto: DoctorSearchDto,
  ): Promise<[DoctorDto[], number]> {
    try {
      const query = await this.doctorRepository.createQueryBuilder('doctors');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (
        doctorSearchDto.description &&
        doctorSearchDto.description.length > 0
      ) {
        query.andWhere('lower(doctors.description) like :description', {
          description: `%${doctorSearchDto.description.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`doctors.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allDoctors, count] = await query.getManyAndCount();

      const doctors = await this.conversionService.toDtos<
        DoctorEntity,
        DoctorDto
      >(allDoctors);

      return [doctors, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreateDoctorDto): Promise<DoctorDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        DoctorEntity,
        DoctorDto
      >(dto);

      const user = await this.getUserById(userId);
      const services: ServiceEntity[] = [];
      for (const serviceId of dto.serviceIds) {
        services.push(await this.getServiceById(serviceId.id));
      }

      dtoToEntity.user = user;
      dtoToEntity.services = services;

      const doctor = this.doctorRepository.create(dtoToEntity);
      await this.doctorRepository.save(doctor);
      return this.conversionService.toDto<DoctorEntity, DoctorDto>(doctor);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateDoctorDto): Promise<DoctorDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const saveDto = await this.getDoctorById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        DoctorEntity,
        DoctorDto
      >({ ...saveDto, ...dto });

      const user = await this.getUserById(userId);
      const services: ServiceEntity[] = [];
      for (const serviceId of dto.serviceIds) {
        services.push(await this.getServiceById(serviceId.id));
      }

      dtoToEntity.user = user;
      dtoToEntity.services = services;

      const updatedDoctor = await this.doctorRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<DoctorEntity, DoctorDto>(
        updatedDoctor,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getDoctorById(id);

      const deleted = await this.doctorRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<DoctorDto> {
    try {
      const doctor = await this.getDoctorById(id);
      return this.conversionService.toDto<DoctorEntity, DoctorDto>(doctor);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getDoctorById(id: string): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(doctor, 'Doctor Not Found!!');
    return doctor;
  }

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

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(user, 'User Not Found!!');
    return user;
  }
  /*********************** End checking relations of post *********************/
}
