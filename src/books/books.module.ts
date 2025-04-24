import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './entity/books.entity';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports:[TypeOrmModule.forFeature([Books]),AuthorsModule],
  providers: [BooksResolver, BooksService],
})
export class BooksModule {}
