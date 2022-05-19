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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'relaxy',
      password: 'relaxy',
      database: 'relaxy',
      entities: [__dirname + '/**/common/entities/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      logger: 'file',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
