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
    // .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  // PORT configaration
  const PORT = process.env.PORT || 5000;
  const HOSTNAME_LOCAL = `http://localhost:${PORT}`;
  const HOSTNAME_127 = `http://127.0.0.1:${PORT}`;

  await app.listen(PORT, () =>
    console.log(`🌎 Started at ${HOSTNAME_LOCAL} & ${HOSTNAME_127}`),
  );
  // swagger page
  console.log(
    `"Swagger" 🌎 Started at ${HOSTNAME_LOCAL}/api & ${HOSTNAME_127}/api`,
  );
}
bootstrap();
