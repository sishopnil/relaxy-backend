import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorSessionTypeDto, DoctorSessionTypeSearchDto } from 'src/common/dtos/doctor-session/doctor-session-type.dto';
import { DoctorSessionTypeEntity } from 'src/common/entities/doctor-session-type.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class DoctorSessionTypeService {
  private redis = {};
  constructor(
    @InjectRepository(DoctorSessionTypeEntity)
    private readonly doctorSessionTypeRepository: Repository<DoctorSessionTypeEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<DoctorSessionTypeDto[]> {
    try {
      const allDoctorSessionTypes = await this.doctorSessionTypeRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<DoctorSessionTypeEntity, DoctorSessionTypeDto>(allDoctorSessionTypes);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    doctorSessionTypeSearchDto: DoctorSessionTypeSearchDto,
  ): Promise<[DoctorSessionTypeDto[], number]> {
    try {
      const query = await this.doctorSessionTypeRepository.createQueryBuilder('doctorSessionType');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (doctorSessionTypeSearchDto.title && doctorSessionTypeSearchDto.title.length > 0) {
        query.andWhere('lower(doctorSessionType.title) like :title', {
          title: `%${doctorSessionTypeSearchDto.title.toLowerCase()}%`,
        });
      }

      if (doctorSessionTypeSearchDto.description && doctorSessionTypeSearchDto.description.length > 0) {
        query.andWhere('lower(doctorSessionType.description) like :description', {
          description: `%${doctorSessionTypeSearchDto.description.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title','description'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`doctorSessionType.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allDoctorSessionTypes, count] = await query.getManyAndCount();

      const doctorSessionTypes = await this.conversionService.toDtos<DoctorSessionTypeEntity, DoctorSessionTypeDto>(
        allDoctorSessionTypes,
      );

      return [doctorSessionTypes, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: DoctorSessionTypeDto): Promise<DoctorSessionTypeDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        DoctorSessionTypeEntity,
        DoctorSessionTypeDto
      >(dto);

      const doctorSessionType = this.doctorSessionTypeRepository.create(dtoToEntity);
      await this.doctorSessionTypeRepository.save(doctorSessionType);
      return this.conversionService.toDto<DoctorSessionTypeEntity, DoctorSessionTypeDto>(doctorSessionType);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: DoctorSessionTypeDto): Promise<DoctorSessionTypeDto> {
    try {
      const saveDto = await this.getDoctorSessionTypeById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        DoctorSessionTypeEntity,
        DoctorSessionTypeDto
      >({ ...saveDto, ...dto });

      const updatedDoctorSessionType = await this.doctorSessionTypeRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<DoctorSessionTypeEntity, DoctorSessionTypeDto>(updatedDoctorSessionType);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getDoctorSessionTypeById(id);

      const deleted = await this.doctorSessionTypeRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<DoctorSessionTypeDto> {
    try {
      const doctorSessionType = await this.getDoctorSessionTypeById(id);
      return this.conversionService.toDto<DoctorSessionTypeEntity, DoctorSessionTypeDto>(doctorSessionType);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getDoctorSessionTypeById(id: string): Promise<DoctorSessionTypeEntity> {
    const doctorSessionType = await this.doctorSessionTypeRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(doctorSessionType, 'Doctor Session Type Not Found!!');
    return doctorSessionType;
  }
  /*********************** End checking relations of post *********************/
}
