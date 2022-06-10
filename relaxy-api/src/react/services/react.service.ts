import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodDto, MoodSearchDto } from 'src/common/dtos/story/mood.dto';
import { ReactDto, ReactSearchDto } from 'src/common/dtos/story/react.dto';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ReactEntity } from 'src/common/entities/react.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class ReactService {
  constructor(
    @InjectRepository(ReactEntity)
    private readonly reactRepository: Repository<ReactEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<ReactDto[]> {
    try {
      const allReacts = await this.reactRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<ReactEntity, ReactDto>(allReacts);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    reactSearchDto: ReactSearchDto,
  ): Promise<[ReactDto[], number]> {
    try {
      const query = await this.reactRepository.createQueryBuilder('reacts');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (reactSearchDto.title && reactSearchDto.title.length > 0) {
        query.andWhere('lower(reacts.title) like :title', {
          title: `%${reactSearchDto.title.toLowerCase()}%`,
        });
      }

      if (reactSearchDto.status && reactSearchDto.status.length > 0) {
        query.andWhere('lower(reacts.status) like :status', {
          status: `%${reactSearchDto.status.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`reacts.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allReacts, count] = await query.getManyAndCount();

      const reacts = await this.conversionService.toDtos<ReactEntity, ReactDto>(
        allReacts,
      );

      return [reacts, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: ReactDto): Promise<ReactDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        ReactEntity,
        ReactDto
      >(dto);

      const react = this.reactRepository.create(dtoToEntity);
      await this.reactRepository.save(react);
      return this.conversionService.toDto<ReactEntity, ReactDto>(react);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: ReactDto): Promise<ReactDto> {
    try {
      const saveDto = await this.getReactById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        ReactEntity,
        ReactDto
      >({ ...saveDto, ...dto });

      const updatedReact = await this.reactRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<ReactEntity, ReactDto>(updatedReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getReactById(id);

      const deleted = await this.reactRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<ReactDto> {
    try {
      const react = await this.getReactById(id);
      return this.conversionService.toDto<ReactEntity, ReactDto>(react);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getReactById(id: string): Promise<ReactEntity> {
    const react = await this.reactRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(react, 'React Not Found!!');
    return react;
  }
  /*********************** End checking relations of post *********************/
}
