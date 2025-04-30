import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 },  
  ));

  new ValidationPipe({
    whitelist: true,
    transform: true, 
})
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
