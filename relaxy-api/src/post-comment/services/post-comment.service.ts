import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostCommentDto } from 'src/common/dtos/posts/create/create-post-comment.dto';
import { PostCommentDto } from 'src/common/dtos/posts/post-comment.dto';
import { PostCommentEntity } from 'src/common/entities/post-comment.entity';
import { PostEntity } from 'src/common/entities/post.entity';
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
export class PostCommentService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostCommentEntity)
    private readonly postCommentRepository: Repository<PostCommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<PostCommentDto[]> {
    try {
      const allReacts = await this.postCommentRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['post', 'commentBy'],
      });
      return this.conversionService.toDtos<PostCommentEntity, PostCommentDto>(
        allReacts,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreatePostCommentDto): Promise<PostCommentDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        PostCommentEntity,
        PostCommentDto
      >(dto);

      const user = await this.getUserById(userId);
      const post = await this.getPostById(dto.postId);

      dtoToEntity.commentBy = user;
      dtoToEntity.post = post;

      const storyReact = this.postCommentRepository.create(dtoToEntity);
      await this.postCommentRepository.save(storyReact);
      return this.conversionService.toDto<PostCommentEntity, PostCommentDto>(
        storyReact,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreatePostCommentDto): Promise<PostCommentDto> {
    try {
      const userId = this.permissionService.returnRequest().id;
      const saveDto = await this.getPostCommentById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        PostCommentEntity,
        PostCommentDto
      >({ ...saveDto, ...dto });
      const user = await this.getUserById(userId);
      const post = await this.getPostById(dto.postId);

      dtoToEntity.commentBy = user;
      dtoToEntity.post = post;

      const updatedReact = await this.postCommentRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<PostCommentEntity, PostCommentDto>(
        updatedReact,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getPostCommentById(id);

      const deleted = await this.postCommentRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<PostCommentDto> {
    try {
      const react = await this.getPostCommentById(id);
      return this.conversionService.toDto<PostCommentEntity, PostCommentDto>(
        react,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getPostCommentById(id: string): Promise<PostCommentEntity> {
    const storyReact = await this.postCommentRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(storyReact, 'Story React Not Found!!');
    return storyReact;
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
