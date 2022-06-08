import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto, UserSearchDto } from 'src/common/dtos/user/user.dto';
import { UserEntity } from 'src/common/entities/user.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly bcryptService: BcryptService,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    try {
      const allUsers = await this.userRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<UserEntity, UserDto>(allUsers);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    userSearchDto: UserSearchDto,
  ): Promise<[UserDto[], number]> {
    try {
      const query = await this.userRepository.createQueryBuilder('users');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (userSearchDto.name && userSearchDto.name.length > 0) {
        query.andWhere('lower(users.name) like :name', {
          name: `%${userSearchDto.name.toLowerCase()}%`,
        });
      }
      if (userSearchDto.email && userSearchDto.email.length > 0) {
        query.andWhere('lower(users.email) like :email', {
          email: `%${userSearchDto.email.toLowerCase()}%`,
        });
      }
      // if (userSearchDto.phone && userSearchDto.phone.length > 0) {
      //   query.andWhere('lower(users.phone) like :phone', {
      //     phone: `%${userSearchDto.phone.toLowerCase()}%`,
      //   });
      // }

      if (userSearchDto.roleName && userSearchDto.roleName.length > 0) {
        query.andWhere('lower(users.roleName) like :roleName', {
          roleName: `%${userSearchDto.roleName.toLowerCase()}%`,
        });
      }
      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = [
        'name',
        'email',
        'phone',
        'roleName',
        'createAt',
        'updatedAt',
      ];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`users.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allUsers, count] = await query.getManyAndCount();

      const users = await this.conversionService.toDtos<UserEntity, UserDto>(
        allUsers,
      );

      return [users, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: UserDto): Promise<UserDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        UserEntity,
        UserDto
      >(dto);

      const user = this.userRepository.create(dtoToEntity);
      await this.userRepository.save(user);
      return this.conversionService.toDto<UserEntity, UserDto>(user);
    } catch (error) {
      console.log(error);

      throw new SystemException(error);
    }
  }

  async update(id: string, dto: UserDto): Promise<UserDto> {
    try {
      const saveDto = await this.getUserById(id);
      if (!!dto.password) {
        dto.password = await this.bcryptService.hashPassword(dto.password);
      }
      const dtoToEntity = await this.conversionService.toEntity<
        UserEntity,
        UserDto
      >({ ...saveDto, ...dto });

      const updatedUser = await this.userRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<UserEntity, UserDto>(updatedUser);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getUserById(id);

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
      const user = await this.getUserById(id);
      return this.conversionService.toDto<UserEntity, UserDto>(user);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

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
