import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFeelingsDto } from 'src/common/dtos/story/create/create-feelings.dto';
import {
  FeelingDto,
  FeelingsSearchDto,
} from 'src/common/dtos/story/feeling.dto';
import { FeelingEntity } from 'src/common/entities/feeling.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class FeelingsService {
  private redis = {};
  constructor(
    @InjectRepository(FeelingEntity)
    private readonly feelingsRepository: Repository<FeelingEntity>,
    @InjectRepository(MoodEntity)
    private readonly moodRepository: Repository<MoodEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<FeelingDto[]> {
    try {
      const allFeelings = await this.feelingsRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['mood'],
      });
      return this.conversionService.toDtos<FeelingEntity, FeelingDto>(
        allFeelings,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    feelingsSearchDto: FeelingsSearchDto,
  ): Promise<[FeelingDto[], number]> {
    try {
      const query = await this.feelingsRepository.createQueryBuilder(
        'feelings',
      );
      query
        .where({ isActive: ActiveStatus.ACTIVE })
        .leftJoinAndSelect('feelings.mood', 'mood');

      if (feelingsSearchDto.title && feelingsSearchDto.title.length > 0) {
        query.andWhere('lower(feelings.title) like :title', {
          title: `%${feelingsSearchDto.title.toLowerCase()}%`,
        });
      }

      if (feelingsSearchDto.status && feelingsSearchDto.status.length > 0) {
        query.andWhere('lower(feelings.status) like :status', {
          status: `%${feelingsSearchDto.status.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`feelings.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allFeelings, count] = await query.getManyAndCount();

      const feelings = await this.conversionService.toDtos<
        FeelingEntity,
        FeelingDto
      >(allFeelings);

      return [feelings, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreateFeelingsDto): Promise<FeelingDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        FeelingEntity,
        FeelingDto
      >(dto);

      const mood = await this.getMoodById(dto.moodId);
      dtoToEntity.mood = mood;
      const feeling = this.feelingsRepository.create(dtoToEntity);
      await this.feelingsRepository.save(feeling);
      return this.conversionService.toDto<FeelingEntity, FeelingDto>(feeling);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateFeelingsDto): Promise<FeelingDto> {
    try {
      const saveDto = await this.getFeelingsById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        FeelingEntity,
        FeelingDto
      >({ ...saveDto, ...dto });

      const mood = await this.getMoodById(dto.moodId);
      dtoToEntity.mood = mood;
      const updatedFeeling = await this.feelingsRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<FeelingEntity, FeelingDto>(
        updatedFeeling,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getFeelingsById(id);

      const deleted = await this.feelingsRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<FeelingDto> {
    try {
      const feeling = await this.getFeelingsById(id);
      return this.conversionService.toDto<FeelingEntity, FeelingDto>(feeling);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getFeelingsById(id: string): Promise<FeelingEntity> {
    const feeling = await this.feelingsRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
      relations: ['mood'],
    });
    this.exceptionService.notFound(feeling, 'Feelings Not Found!!');
    return feeling;
  }

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
