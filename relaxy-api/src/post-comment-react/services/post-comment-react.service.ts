import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostCommentReactDto } from 'src/common/dtos/posts/create/create-post-comment-react.dto';
import { PostCommentReactDto } from 'src/common/dtos/posts/post-comment-react.dto';
import { PostCommentReactEntity } from 'src/common/entities/post-comment-react.entity';
import { PostCommentEntity } from 'src/common/entities/post-comment.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { ReactEntity } from 'src/common/entities/react.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PermissionService } from 'src/common/services/permission.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class PostCommentReactService {
  constructor(
    @InjectRepository(ReactEntity)
    private readonly reactRepository: Repository<ReactEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostCommentReactEntity)
    private readonly postCommentReactRepository: Repository<PostCommentReactEntity>,
    @InjectRepository(PostCommentEntity)
    private readonly postCommentRepository: Repository<PostCommentEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<PostCommentReactDto[]> {
    try {
      const allReacts = await this.postCommentReactRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['postComment', 'react', 'reactedBy'],
      });
      return this.conversionService.toDtos<
        PostCommentReactEntity,
        PostCommentReactDto
      >(allReacts);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreatePostCommentReactDto): Promise<PostCommentReactDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        PostCommentReactEntity,
        PostCommentReactDto
      >(dto);

      const user = await this.getUserById(userId);
      const react = await this.getReactById(dto.reactId);
      const postComment = await this.getPostCommentById(dto.postCommentId);

      dtoToEntity.reactedBy = user;
      dtoToEntity.react = react;
      dtoToEntity.postComment = postComment;

      const storyReact = this.postCommentReactRepository.create(dtoToEntity);
      await this.postCommentReactRepository.save(storyReact);
      return this.conversionService.toDto<
        PostCommentReactEntity,
        PostCommentReactDto
      >(storyReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(
    id: string,
    dto: CreatePostCommentReactDto,
  ): Promise<PostCommentReactDto> {
    try {
      const userId = this.permissionService.returnRequest().id;
      const saveDto = await this.getPostCommentReactById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        PostCommentReactEntity,
        PostCommentReactDto
      >({ ...saveDto, ...dto });

      const user = await this.getUserById(userId);
      const react = await this.getReactById(dto.reactId);
      const postComment = await this.getPostCommentById(dto.postCommentId);

      dtoToEntity.reactedBy = user;
      dtoToEntity.react = react;
      dtoToEntity.postComment = postComment;

      const updatedReact = await this.postCommentReactRepository.save(
        dtoToEntity,
        {
          reload: true,
        },
      );
      return this.conversionService.toDto<
        PostCommentReactEntity,
        PostCommentReactDto
      >(updatedReact);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getPostCommentReactById(id);

      const deleted = await this.postCommentReactRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<PostCommentReactDto> {
    try {
      const react = await this.getPostCommentReactById(id);
      return this.conversionService.toDto<
        PostCommentReactEntity,
        PostCommentReactDto
      >(react);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getPostCommentReactById(id: string): Promise<PostCommentReactEntity> {
    const storyReact = await this.postCommentReactRepository.findOne({
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

  async getPostCommentById(id: string): Promise<PostCommentEntity> {
    const postComment = await this.postCommentRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(postComment, 'Post Comment Not Found!!');
    return postComment;
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
