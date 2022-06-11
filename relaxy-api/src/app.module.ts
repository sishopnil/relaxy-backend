import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigureEnum } from './common/enums/configure.enum';
import { FieldExceptionFilter } from './common/filters/field-exception.filter';
import { SystemExceptionFilter } from './common/filters/system-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { FeelingsModule } from './feelings/feelings.module';
import { MoodModule } from './mood/mood.module';
import { PostTypeModule } from './post-types/post-type.module';
import { ReactModule } from './react/react.module';
import { StoryModule } from './story/story.module';
import { TagModule } from './tag/tag.module';
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
    FeelingsModule,
    ReactModule,
    StoryModule,
    TagModule,
    PostTypeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SystemExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FieldExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      // .exclude(...publicUrls)
      .forRoutes('*');
  }
}
