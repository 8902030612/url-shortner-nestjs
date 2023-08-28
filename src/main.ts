import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger openapi
  const config = new DocumentBuilder()
    .setTitle('VeriDoc URL Shortner')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  // PORT configaration
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () =>
    console.log(`🌎 Started at http://localhost:${PORT}`),
  );
  // swagger page
  console.log(`"Swagger" 🌎 Started at http://localhost:${PORT}/api`);
}
bootstrap();
