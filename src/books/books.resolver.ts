import {  Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Books } from './entity/books.entity';
import { createBookdto } from './dto/createBook.input';
import { authors } from 'src/authors/entity/author.entity';

@Resolver()
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(()=>Books)
  createBook(@Args('CreateBookWithAutor')createBook:createBookdto):Promise<Books>{
    return this.booksService.CreateBook(createBook)
  }

  @Query(()=>[Books])
  getAllBooks():Promise<Books[]>{
    return this.booksService.findAllBooks()
  }

  @Query(()=>authors)
  getbookAuthor(@Args('bookId',{type:()=>Number})bookId:number):Promise<authors>{
    return this.booksService.getBookAuthor(bookId)
  }
  


}
