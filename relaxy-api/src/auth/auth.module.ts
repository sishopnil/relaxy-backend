import { ConversionService } from './../common/services/conversion.service';
import { RequestService } from './../common/services/request.service';
import { BcryptService } from './../common/services/bcrypt.service';
import { ResponseService } from './../common/services/response.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../common/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    AuthService,
    ResponseService,
    BcryptService,
    RequestService,
    ConversionService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
