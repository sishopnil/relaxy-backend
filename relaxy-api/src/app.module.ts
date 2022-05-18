import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigureEnum } from './common/enums/configure.enum';

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
        // host: configService.get(ConfigureEnum.DATABASE_HOST),
        // port: +configService.get(ConfigureEnum.DATABASE_PORT),
        // username: configService.get(ConfigureEnum.DATABASE_USER),
        // password: configService.get(ConfigureEnum.DATABASE_PASSWORD),
        // database: configService.get(ConfigureEnum.DATABASE_DB),
        host: 'relaxy',
        port: 3306,
        username: 'relaxy',
        password: 'relaxy',
        database: 'relaxy',
        entities: [__dirname + '/**/common/entities/*.entity{.ts,.js}'],
        // synchronize: configService.get(ConfigureEnum.DATABASE_SYNCRONIZE),
        // logging: !!configService.get(ConfigureEnum.DATABASE_LOGGING),
        synchronize: true,
        logging: true,
        logger: 'file',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(ConfigService: ConfigService) {
  //   console.log(ConfigService.get(ConfigureEnum.));
  // }
}
