import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { raw, json, urlencoded } from 'express';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // ✅ Raw body for Stripe webhook only
  app.use('/webhook', raw({ type: 'application/json' }));

  // ✅ Normal parsers for everything else
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // GraphQL file uploads
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
