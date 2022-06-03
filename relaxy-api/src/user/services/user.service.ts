import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';
import { ConfigureEnum } from 'src/common/enums/configure.enum';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/common/entities/user.entity';
import { UserDto } from 'src/common/dtos/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    try {
      const allArticleCategories = await this.userRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<UserEntity, UserDto>(
        allArticleCategories,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  // async pagination(
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string,
  // ): Promise<[ArticleCategoryDto[], number]> {
  //   try {
  //     const query = await this.userRepository.createQueryBuilder(
  //       'articleCategory',
  //     );
  //     query.where({ isActive: ActiveStatus.ACTIVE });

  //     if (
  //       articleCategorySearchDto.title &&
  //       articleCategorySearchDto.title.length > 0
  //     ) {
  //       query.andWhere('lower(articleCategory.title) like :tvcTitle', {
  //         tvcTitle: `%${articleCategorySearchDto.title.toLowerCase()}%`,
  //       });
  //     }

  //     sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

  //     const orderFields = ['title', 'featuredImage', 'slug'];

  //     order =
  //       orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';

  //     query
  //       .orderBy('articleCategory.updatedAt', 'DESC')
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     if (
  //       articleCategorySearchDto.title &&
  //       articleCategorySearchDto.title.length > 0
  //     ) {
  //       query.andWhere('lower(articleCategory.title) like :tvcTitle', {
  //         tvcTitle: `%${articleCategorySearchDto.title.toLowerCase()}%`,
  //       });
  //     }

  //     const [allArticleCategories, count] = await query.getManyAndCount();

  //     const articleCategory = await this.conversionService.toDtos<
  //       ArticleCategoryEntity,
  //       ArticleCategoryDto
  //     >(allArticleCategories);

  //     return [articleCategory, count];
  //   } catch (error) {
  //     throw new SystemException(error);
  //   }
  // }

  async create(dto: UserDto): Promise<UserDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        UserEntity,
        UserDto
      >(dto);

      const articleCategory = this.userRepository.create(dtoToEntity);
      await this.userRepository.save(articleCategory);

      return this.conversionService.toDto<UserEntity, UserDto>(articleCategory);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: UserDto): Promise<UserDto> {
    try {
      const saveDto = await this.getarticleCategoryById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        UserEntity,
        UserDto
      >({ ...saveDto, ...dto });

      const updatedarticleCategory = await this.userRepository.save(
        dtoToEntity,
        {
          reload: true,
        },
      );
      return this.conversionService.toDto<UserEntity, UserDto>(
        updatedarticleCategory,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getarticleCategoryById(id);

      const deleted = await this.userRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<UserDto> {
    try {
      const articleCategory = await this.getarticleCategoryById(id);
      return this.conversionService.toDto<UserEntity, UserDto>(articleCategory);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getarticleCategoryById(id: string): Promise<UserEntity> {
    const articleCategory = await this.userRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(
      articleCategory,
      'Article Category Not Found!!',
    );
    return articleCategory;
  }
  /*********************** End checking relations of post *********************/
}
