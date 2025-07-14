import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { raw, json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable raw body only for Stripe webhook
  app.use('/webhook', raw({ type: 'application/json' }));

  // Apply other body parsers (after raw for /webhook)
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // GraphQL file upload
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  // CORS
  app.enableCors();

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
