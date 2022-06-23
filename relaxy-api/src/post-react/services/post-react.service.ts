import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostReactDto } from 'src/common/dtos/posts/create/create-post-react.dto';
import { PostReactDto } from 'src/common/dtos/posts/post-react.dto';
import { PostReactEntity } from 'src/common/entities/post-react.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { ReactEntity } from 'src/common/entities/react.entity';
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
export class PostReactService {
  constructor(
    @InjectRepository(ReactEntity)
    private readonly reactRepository: Repository<ReactEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostReactEntity)
    private readonly postReactRepository: Repository<PostReactEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<PostReactDto[]> {
    try {
      const allReacts = await this.postReactRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['post', 'react', 'reactedBy'],
      });
      return this.conversionService.toDtos<PostReactEntity, PostReactDto>(
        allReacts,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreatePostReactDto): Promise<PostReactDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        PostReactEntity,
        PostReactDto
      >(dto);

      const user = await this.getUserById(userId);
      const react = await this.getReactById(dto.reactId);
      const post = await this.getPostById(dto.postId);

      dtoToEntity.reactedBy = user;
      dtoToEntity.react = react;
      dtoToEntity.post = post;

      const storyReact = this.postReactRepository.create(dtoToEntity);
      await this.postReactRepository.save(storyReact);
      return this.conversionService.toDto<PostReactEntity, PostReactDto>(
        storyReact,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreatePostReactDto): Promise<PostReactDto> {
    try {
      const userId = this.permissionService.returnRequest().id;
      const saveDto = await this.getStoryReactById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        PostReactEntity,
        PostReactDto
      >({ ...saveDto, ...dto });

      const user = await this.getUserById(userId);
      const react = await this.getReactById(dto.reactId);
      const post = await this.getPostById(dto.postId);

      dtoToEntity.reactedBy = user;
      dtoToEntity.react = react;
      dtoToEntity.post = post;

      const updatedReact = await this.postReactRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<PostReactEntity, PostReactDto>(
        updatedReact,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getStoryReactById(id);

      const deleted = await this.postReactRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<PostReactDto> {
    try {
      const react = await this.getStoryReactById(id);
      return this.conversionService.toDto<PostReactEntity, PostReactDto>(react);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getStoryReactById(id: string): Promise<PostReactEntity> {
    const storyReact = await this.postReactRepository.findOne({
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

  async getPostById(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(post, 'Post Not Found!!');
    return post;
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
