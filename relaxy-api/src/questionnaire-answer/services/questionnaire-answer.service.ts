import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionnaireAnswerDto } from 'src/common/dtos/questionnaire/create/create-questionnaire-answer.dto';
import {
  QuestionnaireAnswerDto,
  QuestionnaireAnswerSearchDto,
} from 'src/common/dtos/questionnaire/questionnaire-answer.dto';
import { QuestionnaireAnswerEntity } from 'src/common/entities/questionnaire-answer.entity';
import { QuestionnaireEntity } from 'src/common/entities/questionnaire.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class QuestionnaireAnswerService {
  constructor(
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly moodRepository: Repository<QuestionnaireAnswerEntity>,
    @InjectRepository(QuestionnaireEntity)
    private readonly questionnaireRepository: Repository<QuestionnaireEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<QuestionnaireAnswerDto[]> {
    try {
      const allMoods = await this.moodRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
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
    searchDto: QuestionnaireAnswerSearchDto,
  ): Promise<[QuestionnaireAnswerDto[], number]> {
    try {
      const query = await this.moodRepository.createQueryBuilder('moods');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (searchDto.option && searchDto.option.length > 0) {
        query.andWhere('lower(moods.option) like :option', {
          option: `%${searchDto.option.toLowerCase()}%`,
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
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
      >(allMoods);

      return [moods, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(
    dto: CreateQuestionnaireAnswerDto,
  ): Promise<QuestionnaireAnswerDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
      >(dto);

      const questionnaire = await this.getQuestionnaireById(
        dto.questionnaireId,
      );

      dtoToEntity.questionnaire = questionnaire;

      const mood = this.moodRepository.create(dtoToEntity);
      await this.moodRepository.save(mood);
      return this.conversionService.toDto<
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
      >(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(
    id: string,
    dto: CreateQuestionnaireAnswerDto,
  ): Promise<QuestionnaireAnswerDto> {
    try {
      const saveDto = await this.getMoodById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
      >({ ...saveDto, ...dto });

      const questionnaire = await this.getQuestionnaireById(
        dto.questionnaireId,
      );

      dtoToEntity.questionnaire = questionnaire;

      const updatedMood = await this.moodRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
      >(updatedMood);
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

  async findById(id: string): Promise<QuestionnaireAnswerDto> {
    try {
      const mood = await this.getMoodById(id);
      return this.conversionService.toDto<
        QuestionnaireAnswerEntity,
        QuestionnaireAnswerDto
      >(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getMoodById(id: string): Promise<QuestionnaireAnswerEntity> {
    const mood = await this.moodRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
  }

  async getQuestionnaireById(id: string): Promise<QuestionnaireEntity> {
    const mood = await this.questionnaireRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Questionnaire Not Found!!');
    return mood;
  }
  /*********************** End checking relations of post *********************/
}
