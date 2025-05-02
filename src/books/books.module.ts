import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './entity/books.entity';
import { AuthorsModule } from 'src/authors/authors.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Books]),
    forwardRef(() => AuthorsModule),FileModule],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}