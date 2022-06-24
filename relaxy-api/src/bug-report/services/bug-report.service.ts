import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BugReportDto,
  BugReportSearchDto,
} from 'src/common/dtos/reports/bug-report.dto';
import { BugReportEntity } from 'src/common/entities/bug-report.entity';
import { PostEntity } from 'src/common/entities/post.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PermissionService } from 'src/common/services/permission.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class BugReportService {
  constructor(
    @InjectRepository(BugReportEntity)
    private readonly postReportRepository: Repository<BugReportEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<BugReportDto[]> {
    try {
      const allMoods = await this.postReportRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<BugReportEntity, BugReportDto>(
        allMoods,
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
    bugReportSearchDto: BugReportSearchDto,
  ): Promise<[BugReportDto[], number]> {
    try {
      const query = await this.postReportRepository.createQueryBuilder('moods');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (
        bugReportSearchDto.description &&
        bugReportSearchDto.description.length > 0
      ) {
        query.andWhere('lower(moods.description) like :description', {
          description: `%${bugReportSearchDto.description.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = ['description'];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`moods.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);

      const [allMoods, count] = await query.getManyAndCount();

      const moods = await this.conversionService.toDtos<
        BugReportEntity,
        BugReportDto
      >(allMoods);

      return [moods, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: BugReportDto): Promise<BugReportDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const dtoToEntity = await this.conversionService.toEntity<
        BugReportEntity,
        BugReportDto
      >(dto);

      const user = await this.getUserById(userId);

      dtoToEntity.user = user;

      const mood = this.postReportRepository.create(dtoToEntity);
      await this.postReportRepository.save(mood);
      return this.conversionService.toDto<BugReportEntity, BugReportDto>(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: BugReportDto): Promise<BugReportDto> {
    try {
      const userId = await this.permissionService.returnRequest().id;
      const saveDto = await this.getMoodById(id);

      const dtoToEntity = await this.conversionService.toEntity<
        BugReportEntity,
        BugReportDto
      >({ ...saveDto, ...dto });

      const user = await this.getUserById(userId);

      dtoToEntity.user = user;

      const updatedMood = await this.postReportRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<BugReportEntity, BugReportDto>(
        updatedMood,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getMoodById(id);

      const deleted = await this.postReportRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<BugReportDto> {
    try {
      const mood = await this.getMoodById(id);
      return this.conversionService.toDto<BugReportEntity, BugReportDto>(mood);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getMoodById(id: string): Promise<BugReportEntity> {
    const mood = await this.postReportRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'Mood Not Found!!');
    return mood;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const mood = await this.userRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(mood, 'User Not Found!!');
    return mood;
  }
  /*********************** End checking relations of post *********************/
}
