import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  // const PORT = process.env.PORT;
  // const HOSTNAME_LOCAL = process.env.BASE_URL;
  // await app.listen(PORT);
  // Logger.log(`🚀 Application is running on: ${HOSTNAME_LOCAL}`);
  // Logger.log(`🌎 Swagger is running on: ${HOSTNAME_LOCAL}/${swaggerPrefix}`);
  const port = process.env.PORT || 5000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(
    `🌎 Swagger is running on: http://localhost:${port}/${swaggerPrefix}`,
  );
}
bootstrap();
