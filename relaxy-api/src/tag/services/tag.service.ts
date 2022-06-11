import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto, TagSearchDto } from 'src/common/dtos/posts/tags.dto';
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
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<TagDto[]> {
    try {
      const allTags = await this.tagRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['users'],
      });
      return this.conversionService.toDtos<TagEntity, TagDto>(allTags);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    tagSearchDto: TagSearchDto,
  ): Promise<[TagDto[], number]> {
    try {
      const query = await this.tagRepository.createQueryBuilder('tags');
      query
        .where({ isActive: ActiveStatus.ACTIVE })
        .leftJoinAndSelect('tags.users', 'user');

      if (tagSearchDto.description && tagSearchDto.description.length > 0) {
        query.andWhere('lower(tags.title) like :description', {
          description: `%${tagSearchDto.description.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['title', 'status'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`tags.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allTags, count] = await query.getManyAndCount();

      const tags = await this.conversionService.toDtos<TagEntity, TagDto>(
        allTags,
      );

      return [tags, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: TagDto): Promise<TagDto> {
    try {
      const users: UserEntity[] = [];
      const userId = this.permissionService.returnRequest().id;
      const user = await this.getUserById(userId);
      const dtoToEntity = await this.conversionService.toEntity<
        TagEntity,
        TagDto
      >(dto);

      users.push(user);

      dtoToEntity.users = users;

      const tag = this.tagRepository.create(dtoToEntity);
      await this.tagRepository.save(tag);
      return this.conversionService.toDto<TagEntity, TagDto>(tag);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: TagDto): Promise<TagDto> {
    try {
      const saveDto = await this.gettagById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        TagEntity,
        TagDto
      >({ ...saveDto, ...dto });

      const updatedtag = await this.tagRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<TagEntity, TagDto>(updatedtag);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.gettagById(id);

      const deleted = await this.tagRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<TagDto> {
    try {
      const tag = await this.gettagById(id);
      return this.conversionService.toDto<TagEntity, TagDto>(tag);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

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
