import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryReactDto } from 'src/common/dtos/story/create/create-story-react.dto';
import {  ReactSearchDto } from 'src/common/dtos/story/react.dto';
import { StoryReactDto } from 'src/common/dtos/story/story-react.dto';
import { ReactEntity } from 'src/common/entities/react.entity';
import { StoryReactEntity } from 'src/common/entities/story-react.entity';
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
export class StoryReactService {
  constructor(
    @InjectRepository(ReactEntity)
    private readonly reactRepository: Repository<ReactEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StoryReactEntity)
    private readonly storyReactRepository: Repository<StoryReactEntity>,
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<StoryReactDto[]> {
    try {
      const allReacts = await this.storyReactRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations:['story','react','reactedBy']
      });
      return this.conversionService.toDtos<StoryReactEntity, StoryReactDto>(allReacts);
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
  //     const query = await this.storyReactRepository.createQueryBuilder('reacts');
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

  //     const reacts = await this.conversionService.toDtos<StoryReactEntity, StoryReactDto>(
  //       allReacts,
  //     );

  //     return [reacts, count];
  //   } catch (error) {
  //     throw new SystemException(error);
  //   }
  // }

  async create(dto: CreateStoryReactDto): Promise<StoryReactDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        StoryReactEntity,
        StoryReactDto
      >(dto);

      const user = await this.getUserById(userId);
      const story = await this.getStoryById(dto.storyId)
      const react = await this.getReactById(dto.reactId);

      dtoToEntity.reactedBy = user;
      dtoToEntity.story = story;
      dtoToEntity.react = react;

      const storyReact = this.storyReactRepository.create(dtoToEntity);
      await this.storyReactRepository.save(storyReact);
      return this.conversionService.toDto<StoryReactEntity, StoryReactDto>(storyReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateStoryReactDto): Promise<StoryReactDto> {
    try {
      const userId = this.permissionService.returnRequest().id;
      const saveDto = await this.getStoryReactById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        StoryReactEntity,
        StoryReactDto
      >({ ...saveDto, ...dto });
      const user = await this.getUserById(userId);
      const story = await this.getStoryById(dto.storyId)
      const react = await this.getReactById(dto.reactId);

      dtoToEntity.reactedBy = user;
      dtoToEntity.story = story;
      dtoToEntity.react = react;

      const updatedReact = await this.storyReactRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<StoryReactEntity, StoryReactDto>(updatedReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getStoryReactById(id);

      const deleted = await this.storyReactRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<StoryReactDto> {
    try {
      const react = await this.getStoryReactById(id);
      return this.conversionService.toDto<StoryReactEntity, StoryReactDto>(react);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getStoryReactById(id: string): Promise<StoryReactEntity> {
    const storyReact = await this.storyReactRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(storyReact, 'Story React Not Found!!');
    return storyReact;
  }

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
