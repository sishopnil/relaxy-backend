import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/common/dtos/posts/create/create-post.dto';
import { PostDto, PostSearchDto } from 'src/common/dtos/posts/post.dto';
import { FeelingEntity } from 'src/common/entities/feeling.entity';
import { MoodEntity } from 'src/common/entities/mood.entity';
import { PostTypeEntity } from 'src/common/entities/post-type.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { TagEntity } from 'src/common/entities/tags.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PermissionService } from 'src/common/services/permission.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostTypeEntity)
    private readonly postTypeRepository: Repository<PostTypeEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<PostDto[]> {
    try {
      const allPosts = await this.postRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['user', 'postType', 'tags'],
      });
      return this.conversionService.toDtos<PostEntity, PostDto>(allPosts);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    postSearchDto: PostSearchDto,
  ): Promise<[PostDto[], number]> {
    try {
      const query = await this.postRepository.createQueryBuilder('posts');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (postSearchDto.description && postSearchDto.description.length > 0) {
        query.andWhere('lower(posts.description) like :description', {
          description: `%${postSearchDto.description.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['description'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`posts.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allPosts, count] = await query.getManyAndCount();

      const posts = await this.conversionService.toDtos<PostEntity, PostDto>(
        allPosts,
      );

      return [posts, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreatePostDto): Promise<PostDto> {
    try {
      console.log('🔥🔥🔥🔥🔥', this.permissionService.returnRequest());
      const userId = await this.permissionService.returnRequest().id;

      const user = await this.getUserById(userId);
      const postType = await this.getPostTypeById(dto.postTypeId);
      const tags: TagEntity[] = [];

      for (const tagId of dto.tagsId) {
        const tag = await this.gettagById(tagId.id);
        tags.push(tag);
      }

      const dtoToEntity = await this.conversionService.toEntity<
        PostEntity,
        PostDto
      >(dto);

      dtoToEntity.user = user;
      dtoToEntity.postType = postType;
      dtoToEntity.tags = tags;

      const post = this.postRepository.create(dtoToEntity);
      await this.postRepository.save(post);
      return this.conversionService.toDto<PostEntity, PostDto>(post);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreatePostDto): Promise<PostDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const user = await this.getUserById(userId);
      const postType = await this.getPostTypeById(dto.postTypeId);
      const tags: TagEntity[] = [];

      for (const tagId of dto.tagsId) {
        const tag = await this.gettagById(tagId.id);
        tags.push(tag);
      }

      const saveDto = await this.getPostById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        PostEntity,
        PostDto
      >({ ...saveDto, ...dto });

      dtoToEntity.user = user;
      dtoToEntity.postType = postType;
      dtoToEntity.tags = tags;

      const updatedPost = await this.postRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<PostEntity, PostDto>(updatedPost);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getPostById(id);

      const deleted = await this.postRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<PostDto> {
    try {
      const post = await this.getPostById(id);
      return this.conversionService.toDto<PostEntity, PostDto>(post);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

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

  async getPostTypeById(id: string): Promise<PostTypeEntity> {
    const postType = await this.postTypeRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(postType, 'Post Type Not Found!!');
    return postType;
  }

  async gettagById(id: string): Promise<TagEntity> {
    const tag = await this.tagRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(tag, 'tag Not Found!!');
    return tag;
  }
  /*********************** End checking relations of post *********************/
}
