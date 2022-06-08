import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SystemExceptionFilter } from './common/filters/system-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MoodModule } from './mood/mood.module';
import { UserModule } from './user/user.module';

const ENV = process.env['NODE_ENV'];
const envFilePath = [`env/${!ENV ? `.env` : `.env.${ENV}`}`];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'shovon',
        password: 'password',
        database: 'relaxy',
        entities: [__dirname + '/**/common/entities/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
        logger: 'file',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    MoodModule,
  ],
  // controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SystemExceptionFilter,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: FieldExceptionFilter,
    // },
  ],
})
export class AppModule {
  constructor() {
    console.log(__dirname);
  }
}
