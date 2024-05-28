import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'Custom-Header',
  // });

  // swagger openapi
  const swaggerPrefix = 'swagger';
  const config = new DocumentBuilder()
    .setTitle('VeriDoc URL Shortner')
    .setDescription('The API description')
    .setVersion('1.0')
    // .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPrefix, app, document);

  app.enableCors();

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // PORT configaration
  const port = configService.getOrThrow<number>('PORT');
  const baseUrl = configService.getOrThrow<string>('BASE_URL');

  await app.listen(port);

  Logger.log(`🚀 Application is running on: ${baseUrl}`);
  Logger.log(`🌎 Swagger is running on: ${baseUrl}/${swaggerPrefix}`);
}
bootstrap();
