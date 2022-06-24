import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionnaireDto,
  QuestionnaireSearchDto,
} from 'src/common/dtos/questionnaire/questionnaire.dto';
import { QuestionnaireEntity } from 'src/common/entities/questionnaire.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireEntity)
    private readonly questionnaireRepository: Repository<QuestionnaireEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<QuestionnaireDto[]> {
    try {
      const allMoods = await this.questionnaireRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<
        QuestionnaireEntity,
        QuestionnaireDto
      >(allMoods);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    questionnaireSearchDto: QuestionnaireSearchDto,
  ): Promise<[QuestionnaireDto[], number]> {
    try {
      const query = await this.questionnaireRepository.createQueryBuilder(
        'moods',
      );
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (
        questionnaireSearchDto.title &&
        questionnaireSearchDto.title.length > 0
      ) {
        query.andWhere('lower(moods.title) like :title', {
          title: `%${questionnaireSearchDto.title.toLowerCase()}%`,
        });
      }

      if (
        questionnaireSearchDto.status &&
        questionnaireSearchDto.status.length > 0
      ) {
        query.andWhere('lower(moods.status) like :status', {
          status: `%${questionnaireSearchDto.status.toLowerCase()}%`,
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

      const moods = await this.conversionService.toDtos<
        QuestionnaireEntity,
        QuestionnaireDto
      >(allMoods);

      return [moods, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: QuestionnaireDto): Promise<QuestionnaireDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        QuestionnaireEntity,
        QuestionnaireDto
      >(dto);

      const mood = this.questionnaireRepository.create(dtoToEntity);
      await this.questionnaireRepository.save(mood);
      return this.conversionService.toDto<
        QuestionnaireEntity,
        QuestionnaireDto
      >(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: QuestionnaireDto): Promise<QuestionnaireDto> {
    try {
      const saveDto = await this.getMoodById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        QuestionnaireEntity,
        QuestionnaireDto
      >({ ...saveDto, ...dto });

      const updatedMood = await this.questionnaireRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<
        QuestionnaireEntity,
        QuestionnaireDto
      >(updatedMood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getMoodById(id);

      const deleted = await this.questionnaireRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<QuestionnaireDto> {
    try {
      const mood = await this.getMoodById(id);
      return this.conversionService.toDto<
        QuestionnaireEntity,
        QuestionnaireDto
      >(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getMoodById(id: string): Promise<QuestionnaireEntity> {
    const mood = await this.questionnaireRepository.findOne({
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
