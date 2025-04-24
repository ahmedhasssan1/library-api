import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from './entity/books.entity';
import { Repository } from 'typeorm';
import { createBookdto } from './dto/createBook.input';
import { AuthorsService } from 'src/authors/authors.service';
import { authors } from 'src/authors/entity/author.entity';

@Injectable()
export class BooksService {
    constructor(@InjectRepository(Books) private BookRepo:Repository<Books>,
    private authorService:AuthorsService

){}

    async CreateBook( createbook:createBookdto):Promise<Books>{
        
        const findAuthor=await this.authorService.findOne(createbook.author);
        if(!findAuthor){
            throw new NotFoundException('this author not exist');
        }
        const createBook=this.BookRepo.create({
            name:createbook.name,
            author:findAuthor
        }
        )
        console.log('debugging ',createBook);
        

        return  await this.BookRepo.save(createBook)
    }

    async findAllBooks():Promise<Books[]>{
        const AllBooks=await this.BookRepo.find({relations:['author']});
        if(!AllBooks){
            throw new NotFoundException("no books exist")
        }
        return AllBooks;
    }
    async getBookAuthor(bookId:number):Promise<authors>{
        const Book= await this.BookRepo.findOneOrFail({where:{id:bookId},relations:['author']})
        if(!Book){
            throw new NotFoundException('this book not existing');
        
        }
        return Book.author;

    }

    
}
