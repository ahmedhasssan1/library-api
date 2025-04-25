import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './entity/books.entity';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Books]),
    forwardRef(() => AuthorsModule)],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}