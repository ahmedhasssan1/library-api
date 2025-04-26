import {  Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Books } from './entity/books.entity';
import { createBookdto } from './dto/createBook.input';
import { authors } from 'src/authors/entity/author.entity';
import { updateDto } from './dto/update.input';

@Resolver(()=>Books)
export class BooksResolver {
  constructor(private readonly booksService: BooksService,

  ) {}

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
  
  @ResolveField(()=>authors)
  getAuthor(@Parent() book:Books):Promise<authors>{
    return this.booksService.getAuthor(book.id)
  }
  
  @Mutation(()=>Books)
  updateBook(@Args('updateBook')updateBook:updateDto): Promise<Books> {
    return this.booksService.updateBook(updateBook);
  }

  @Query(()=>[Books])
  getAuthorBooks(@Args('auhtorID',{type:()=>Int})authorID:number){
    return this.booksService.findAuthorBooks(authorID);
  }

  @Query(()=>Books)
  getOneBook(@Args('findBook',{type:()=>Int})id:number):Promise<Books>{
    return this.booksService.findOneBook(id);
  }
 
 

}
