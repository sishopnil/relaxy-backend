import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from 'src/common/dtos/story/create/create-story.dto';
import { MoodSearchDto } from 'src/common/dtos/story/mood.dto';
import { StoryDto, StorySearchDto } from 'src/common/dtos/story/story.dto';
import { FeelingEntity } from 'src/common/entities/feeling.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { StoryEntity } from 'src/common/entities/story.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PermissionService } from 'src/common/services/permission.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    @InjectRepository(StoryEntity)
    private readonly moodRepository: Repository<MoodEntity>,
    @InjectRepository(FeelingEntity)
    private readonly feelingRepository: Repository<FeelingEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<StoryDto[]> {
    try {
      const allStories = await this.storyRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<StoryEntity, StoryDto>(allStories);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    storySearchDto: StorySearchDto,
  ): Promise<[StoryDto[], number]> {
    try {
      const query = await this.storyRepository.createQueryBuilder('stories');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (storySearchDto.description && storySearchDto.description.length > 0) {
        query.andWhere('lower(stories.title) like :title', {
          title: `%${storySearchDto.description.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`stories.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allMoods, count] = await query.getManyAndCount();

      const moods = await this.conversionService.toDtos<StoryEntity, StoryDto>(
        allMoods,
      );

      return [moods, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreateStoryDto): Promise<StoryDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const user = await this.getUserById(userId);
      const mood = await this.getMoodById(dto.moodId);
      const feeling = await this.getFeelingsById(dto.feelingId);

      const dtoToEntity = await this.conversionService.toEntity<
        StoryEntity,
        StoryDto
      >(dto);

      dtoToEntity.user = user;
      dtoToEntity.mood = mood;
      dtoToEntity.feeling = feeling;

      const story = this.storyRepository.create(dtoToEntity);
      await this.storyRepository.save(story);
      return this.conversionService.toDto<StoryEntity, StoryDto>(story);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateStoryDto): Promise<StoryDto> {
    try {
      const saveDto = await this.getStoryById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        StoryEntity,
        StoryDto
      >({ ...saveDto, ...dto });

      const updatedMood = await this.storyRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<StoryEntity, StoryDto>(updatedMood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getStoryById(id);

      const deleted = await this.storyRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<StoryDto> {
    try {
      const mood = await this.getStoryById(id);
      return this.conversionService.toDto<StoryEntity, StoryDto>(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getStoryById(id: string): Promise<StoryEntity> {
    const mood = await this.storyRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
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

  async getFeelingsById(id: string): Promise<FeelingEntity> {
    const feeling = await this.feelingRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
      relations: ['mood'],
    });
    this.exceptionService.notFound(feeling, 'Feelings Not Found!!');
    return feeling;
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
