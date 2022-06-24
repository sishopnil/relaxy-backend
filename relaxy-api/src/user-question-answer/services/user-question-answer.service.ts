import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserQuestionnaireAnswerDto } from 'src/common/dtos/questionnaire/create/create-user-questionnaire-answer.dto';
import { UserQuestionnaireAnsweDto } from 'src/common/dtos/questionnaire/user-questionnaire-answer.dto';
import { QuestionnaireAnswerEntity } from 'src/common/entities/questionnaire-answer.entity';
import { QuestionnaireEntity } from 'src/common/entities/questionnaire.entity';
import { UserQuestionAnswerEntity } from 'src/common/entities/user-question-answer.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PermissionService } from 'src/common/services/permission.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class UserQuestionAnswerService {
  private redis = {};
  constructor(
    @InjectRepository(UserQuestionAnswerEntity)
    private readonly moodRepository: Repository<UserQuestionAnswerEntity>,
    @InjectRepository(QuestionnaireEntity)
    private readonly questionnaireRepository: Repository<QuestionnaireEntity>,
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly questionnireAnswerRepository: Repository<QuestionnaireAnswerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<UserQuestionnaireAnsweDto[]> {
    try {
      const allMoods = await this.moodRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
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
  ): Promise<[UserQuestionnaireAnsweDto[], number]> {
    try {
      const query = await this.moodRepository.createQueryBuilder('moods');
      query.where({ isActive: ActiveStatus.ACTIVE });

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
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
      >(allMoods);

      return [moods, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(
    dto: CreateUserQuestionnaireAnswerDto,
  ): Promise<UserQuestionnaireAnsweDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
      >(dto);

      const user = await this.getUserById(userId);
      const questionnaire = await this.getQuestionById(dto.questionnaireId);
      const questionnaireAnswer = await this.getQuestionnaireAnswerById(
        dto.questionAnswerId,
      );

      dtoToEntity.user = user;
      dtoToEntity.questionnaire = questionnaire;
      dtoToEntity.questionnaireAnswer = questionnaireAnswer;

      const mood = this.moodRepository.create(dtoToEntity);
      await this.moodRepository.save(mood);
      return this.conversionService.toDto<
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
      >(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(
    id: string,
    dto: CreateUserQuestionnaireAnswerDto,
  ): Promise<UserQuestionnaireAnsweDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const saveDto = await this.getMoodById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
      >({ ...saveDto, ...dto });

      const user = await this.getUserById(userId);
      const questionnaire = await this.getQuestionById(dto.questionnaireId);
      const questionnaireAnswer = await this.getQuestionnaireAnswerById(
        dto.questionAnswerId,
      );

      dtoToEntity.user = user;
      dtoToEntity.questionnaire = questionnaire;
      dtoToEntity.questionnaireAnswer = questionnaireAnswer;

      const updatedMood = await this.moodRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
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

  async findById(id: string): Promise<UserQuestionnaireAnsweDto> {
    try {
      const mood = await this.getMoodById(id);
      return this.conversionService.toDto<
        UserQuestionAnswerEntity,
        UserQuestionnaireAnsweDto
      >(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getMoodById(id: string): Promise<UserQuestionAnswerEntity> {
    const mood = await this.moodRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
  }

  async getQuestionById(id: string): Promise<QuestionnaireEntity> {
    const mood = await this.questionnaireRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
  }

  async getQuestionnaireAnswerById(
    id: string,
  ): Promise<QuestionnaireAnswerEntity> {
    const mood = await this.questionnireAnswerRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const mood = await this.userRepository.findOne({
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
