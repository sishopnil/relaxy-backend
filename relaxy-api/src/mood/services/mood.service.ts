import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { ConfigureEnum } from 'src/common/enums/configure.enum';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { MoodDto, MoodSearchDto } from 'src/common/dtos/story/mood.dto';

@Injectable()
export class MoodService {
  private redis = {};
  constructor(
    @InjectRepository(MoodEntity)
    private readonly moodRepository: Repository<MoodEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<MoodDto[]> {
    try {
      const allMoods = await this.moodRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<MoodEntity, MoodDto>(allMoods);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    moodSearchDto: MoodSearchDto,
  ): Promise<[MoodDto[], number]> {
    try {
      const query = await this.moodRepository.createQueryBuilder('moods');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (moodSearchDto.title && moodSearchDto.title.length > 0) {
        query.andWhere('lower(moods.title) like :title', {
          title: `%${moodSearchDto.title.toLowerCase()}%`,
        });
      }

      if (moodSearchDto.status && moodSearchDto.status.length > 0) {
        query.andWhere('lower(moods.status) like :status', {
          status: `%${moodSearchDto.status.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`moods.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allMoods, count] = await query.getManyAndCount();

      const moods = await this.conversionService.toDtos<MoodEntity, MoodDto>(
        allMoods,
      );

      return [moods, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: MoodDto): Promise<MoodDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        MoodEntity,
        MoodDto
      >(dto);

      const mood = this.moodRepository.create(dtoToEntity);
      await this.moodRepository.save(mood);
      return this.conversionService.toDto<MoodEntity, MoodDto>(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: MoodDto): Promise<MoodDto> {
    try {
      const saveDto = await this.getMoodById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        MoodEntity,
        MoodDto
      >({ ...saveDto, ...dto });

      const updatedMood = await this.moodRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<MoodEntity, MoodDto>(updatedMood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getMoodById(id);

      const deleted = await this.moodRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<MoodDto> {
    try {
      const mood = await this.getMoodById(id);
      return this.conversionService.toDto<MoodEntity, MoodDto>(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getMoodById(id: string): Promise<MoodEntity> {
    const mood = await this.moodRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
  }
  /*********************** End checking relations of post *********************/
}
