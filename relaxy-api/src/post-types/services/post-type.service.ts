import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PostTypeDto,
  PostTypeSearchDto,
} from 'src/common/dtos/posts/post-type.dto';
import { PostTypeEntity } from 'src/common/entities/post-type.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class PostTypeService {
  constructor(
    @InjectRepository(PostTypeEntity)
    private readonly postTypeRepository: Repository<PostTypeEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<PostTypeDto[]> {
    try {
      const allPostTypes = await this.postTypeRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<PostTypeEntity, PostTypeDto>(
        allPostTypes,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    postTypeSearchDto: PostTypeSearchDto,
  ): Promise<[PostTypeDto[], number]> {
    try {
      const query = await this.postTypeRepository.createQueryBuilder(
        'postTypes',
      );
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (postTypeSearchDto.title && postTypeSearchDto.title.length > 0) {
        query.andWhere('lower(postTypes.title) like :title', {
          title: `%${postTypeSearchDto.title.toLowerCase()}%`,
        });
      }

      if (postTypeSearchDto.status && postTypeSearchDto.status.length > 0) {
        query.andWhere('lower(postTypes.status) like :status', {
          status: `%${postTypeSearchDto.status.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`postTypes.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allPostTypes, count] = await query.getManyAndCount();

      const postTypes = await this.conversionService.toDtos<
        PostTypeEntity,
        PostTypeDto
      >(allPostTypes);

      return [postTypes, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: PostTypeDto): Promise<PostTypeDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        PostTypeEntity,
        PostTypeDto
      >(dto);

      const postType = this.postTypeRepository.create(dtoToEntity);
      await this.postTypeRepository.save(postType);
      return this.conversionService.toDto<PostTypeEntity, PostTypeDto>(
        postType,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: PostTypeDto): Promise<PostTypeDto> {
    try {
      const saveDto = await this.getPostTypeById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        PostTypeEntity,
        PostTypeDto
      >({ ...saveDto, ...dto });

      const updatedPostType = await this.postTypeRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<PostTypeEntity, PostTypeDto>(
        updatedPostType,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getPostTypeById(id);

      const deleted = await this.postTypeRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<PostTypeDto> {
    try {
      const postType = await this.getPostTypeById(id);
      return this.conversionService.toDto<PostTypeEntity, PostTypeDto>(
        postType,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

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
  /*********************** End checking relations of post *********************/
}
