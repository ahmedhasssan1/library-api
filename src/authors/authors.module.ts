import { Module, forwardRef } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authors } from './entity/author.entity';
import { Books } from 'src/books/entity/books.entity';
import { BooksModule } from 'src/books/books.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([authors, Books]),
  forwardRef(() => BooksModule)],
  providers: [AuthorsResolver, AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}