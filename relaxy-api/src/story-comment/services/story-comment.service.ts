import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryCommentDto } from 'src/common/dtos/story/create/create-story-comment.dto copy';
import { StoryCommentDto } from 'src/common/dtos/story/story-comment.dto';
import { ReactEntity } from 'src/common/entities/react.entity';
import { StoryCommentEntity } from 'src/common/entities/story-comment.entity';
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
export class StoryCommentService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StoryCommentEntity)
    private readonly storyCommentRepository: Repository<StoryCommentEntity>,
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<StoryCommentDto[]> {
    try {
      const allReacts = await this.storyCommentRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations:['story','commentBy']
      });
      return this.conversionService.toDtos<StoryCommentEntity, StoryCommentDto>(allReacts);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  // async pagination(
  //   page: number,
  //   limit: number,
  //   sort: 'DESC' | 'ASC',
  //   order: string,
  // ): Promise<[StoryReactDto[], number]> {
  //   try {
  //     const query = await this.storyCommentRepository.createQueryBuilder('reacts');
  //     query.where({ isActive: ActiveStatus.ACTIVE });

  //     sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

  //     const orderFields = ['title', 'status'];
  //     order =
  //       orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
  //     query
  //       .orderBy(`reacts.${order}`, sort)
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     const [allReacts, count] = await query.getManyAndCount();

  //     const reacts = await this.conversionService.toDtos<StoryCommentEntity, StoryReactDto>(
  //       allReacts,
  //     );

  //     return [reacts, count];
  //   } catch (error) {
  //     throw new SystemException(error);
  //   }
  // }

  async create(dto: CreateStoryCommentDto): Promise<StoryCommentDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        StoryCommentEntity,
        StoryCommentDto
      >(dto);

      const user = await this.getUserById(userId);
      const story = await this.getStoryById(dto.storyId)

      dtoToEntity.commentBy = user;
      dtoToEntity.story = story;

      const storyReact = this.storyCommentRepository.create(dtoToEntity);
      await this.storyCommentRepository.save(storyReact);
      return this.conversionService.toDto<StoryCommentEntity, StoryCommentDto>(storyReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateStoryCommentDto): Promise<StoryCommentDto> {
    try {
      const userId = this.permissionService.returnRequest().id;
      const saveDto = await this.getStoryReactById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        StoryCommentEntity,
        StoryCommentDto
      >({ ...saveDto, ...dto });
      const user = await this.getUserById(userId);
      const story = await this.getStoryById(dto.storyId)

      dtoToEntity.commentBy = user;
      dtoToEntity.story = story;

      const updatedReact = await this.storyCommentRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<StoryCommentEntity, StoryCommentDto>(updatedReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getStoryReactById(id);

      const deleted = await this.storyCommentRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<StoryCommentDto> {
    try {
      const react = await this.getStoryReactById(id);
      return this.conversionService.toDto<StoryCommentEntity, StoryCommentDto>(react);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getStoryReactById(id: string): Promise<StoryCommentEntity> {
    const storyReact = await this.storyCommentRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(storyReact, 'Story React Not Found!!');
    return storyReact;
  }

  async getStoryById(id: string): Promise<StoryEntity> {
    const story = await this.storyRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(story, 'Story Not Found!!');
    return story;
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
