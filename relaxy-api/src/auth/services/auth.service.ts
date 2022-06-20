import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as Redis from 'ioredis';
import { CustomUserRoleDto } from 'src/common/dtos/user/custom-user-role.dto';
import { Brackets, Repository } from 'typeorm';
import { LoginDto } from '../../common/dtos/user/create/login.dto';
import { UserEntity } from '../../common/entities/user.entity';
import { ConfigureEnum } from '../../common/enums/configure.enum';
import { UserResponseDto } from './../../common/dtos/reponse/user-response.dto';
import { UserDto } from './../../common/dtos/user/user.dto';
import { ActiveStatus } from './../../common/enums/active.enum';
import { SystemException } from './../../common/exceptions/system.exception';
import { BcryptService } from './../../common/services/bcrypt.service';
import { ConversionService } from './../../common/services/conversion.service';
import { RequestService } from './../../common/services/request.service';

@Injectable()
export class AuthService {
  private salts = [
    'e01d5ff573c96f085f496daecb25b91350a676ff555186a41024a9fa0dd05678ea9398f794e0db11e5ab219fdc426ad0afbf5663832d82c71c18f6341ba646bc',
  ];
  private secrets = [
    '7b8dfee2268d116238b7977a87df037dbc360534884967c7b95cb43663e31c8fcfcae1d663f41a43a30f479dd7af24964e196a7ee6a0e00da5bb36e4a5ee3e5b',
  ];
  private redis = {};
  constructor(
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private readonly requestService: RequestService,
    private readonly conversionService: ConversionService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.salts = `${configService.get(ConfigureEnum.CRYPTO_SOLT)}`.split(',');
    this.secrets = `${configService.get(ConfigureEnum.CRYPTO_SCERET)}`.split(
      ',',
    );
    this.redis[ConfigureEnum.REDIS_SESSION] = new Redis(
      configService.get(ConfigureEnum.REDIS_SESSION),
    );
  }

  create = async (usersDto: UserDto): Promise<any> => {
    try {
      const user = await this.createUser(usersDto);
      return this.conversionService.toDto<UserEntity, UserDto>(user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  login = async (loginDto: LoginDto): Promise<UserResponseDto> => {
    try {
      const user = await this.validateUser(loginDto);
      const accessToken = await this.generateToken(user);
      user.password = undefined;
      const userRoles = new CustomUserRoleDto();
      userRoles.role = user.roleName;
      const userRes: UserResponseDto = new UserResponseDto();
      userRes.accessToken = accessToken;
      userRes.email = user.email;
      // userRes.phone = user.phone;
      userRes.roles = userRoles;
      userRes.userName = user.name;
      userRes.id = user.id;
      if (!!loginDto.isChecked) {
        this.redis[ConfigureEnum.REDIS_SESSION].set(
          accessToken,
          JSON.stringify(userRes),
        );
      } else {
        this.redis[ConfigureEnum.REDIS_SESSION].set(
          accessToken,
          JSON.stringify(userRes),
          'ex',
          parseInt(
            `${this.configService.get(ConfigureEnum.TOKEN_EXPIRE_TIME)}`,
          ),
        );
      }

      return userRes;
    } catch (error) {
      console.log(error);

      throw new SystemException(error);
    }
    return undefined;
  };

  private createUser = async (usersDto: UserDto): Promise<UserEntity> => {
    // const isPhoneDupicate = await this.userRepository.findOne({
    //   phone: usersDto.phone,
    // });
    // if (isPhoneDupicate) {
    //   throw new Error('Phone number already is in use');
    // }

    const isEmailDupicate = await this.userRepository.findOne({
      email: usersDto.email,
    });
    if (isEmailDupicate) {
      throw new Error('Email address already is in use');
    }

    usersDto.password = await this.bcryptService.hashPassword(
      usersDto.password,
    );

    let userDto: UserDto = usersDto;
    userDto = this.requestService.forCreate(userDto);

    const dtoToEntity = await this.conversionService.toEntity<
      UserEntity,
      UserDto
    >(userDto);
    const user = this.userRepository.create(dtoToEntity);
    user.isActive = ActiveStatus.ACTIVE;
    user.roleName = usersDto.roleName;

    await this.userRepository.save(user);

    console.log('ttttttttttttttttttttttttttttttttt', user);
    return user;
  };

  private validateUser = async (loginDto: LoginDto): Promise<UserDto> => {
    const userQuery = await this.userRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((subQ) => {
          subQ.where('user.email = :email', { email: loginDto.email });
          // subQ.orWhere('user.phone = :phone', { phone: loginDto.phone });
        }),
      )
      .andWhere('user.isActive = :isActive', { isActive: ActiveStatus.ACTIVE });
    const user = await userQuery.getOne();
    console.log(user, loginDto);
    if (!user) {
      throw new Error('Login credentials not accepted');
    }

    if (
      !(await this.bcryptService.comparePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Login credentials not accepted');
    }
    return this.conversionService.toDto<UserEntity, UserDto>(user);
  };

  private generateToken = async (user: UserDto) => {
    try {
      console.log(user);

      const rSecretIndex = Math.floor(
        Math.random() * Math.floor(this.secrets.length),
      );
      const rSaltIndex = Math.floor(
        Math.random() * Math.floor(this.salts.length),
      );
      const hmac = crypto.createHmac('sha512', this.secrets[rSecretIndex]);
      const token = hmac
        .update(
          this.salts[rSaltIndex] +
            crypto.randomBytes(19).toString('hex') +
            JSON.stringify(user) +
            Date.now(),
        )
        .digest('hex');
      return token;
    } catch (error) {
      console.log(error);
      console.log(error);

      return 'asd';
    }
  };
}
