import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Realxy')
    .setDescription('Realxy API DOC')
    .setVersion('1.0')
    .addTag('Realxy')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document, {
    customSiteTitle: 'Realxy API DOC',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(2001);
  console.log('Server is running on http://localhost/api/doc');
}
bootstrap();
