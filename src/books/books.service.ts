import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from './entity/books.entity';
import { Repository } from 'typeorm';
import { createBookdto } from './dto/createBook.input';
import { AuthorsService } from 'src/authors/authors.service';
import { authors } from 'src/authors/entity/author.entity';
import { updateDto } from './dto/update.input';

@Injectable()
export class BooksService {
    constructor(@InjectRepository(Books) private BookRepo:Repository<Books>,
    private authorService:AuthorsService

){}

    async findOneBook(id:number):Promise<Books>{
        const book=await this.BookRepo.findOne({where:{id}})
        if(!book){
            throw new NotFoundException('this book not exist')
        }
        return book;
    }

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

    async updateBook(updateBook:updateDto):Promise<Books>{
       const  book=await this.BookRepo.update(updateBook.id,{...updateBook})
        const findbookIpdated=await this.BookRepo.findOneOrFail({where:{id:updateBook.id}});
        if(!findbookIpdated){
            throw new NotFoundException('this book not existing any more')
        }
        return findbookIpdated;
    }

    async getAuthor(id:number):Promise<authors>{
        const author=await this.authorService.findOne(id);
        return author;
    }

    async findAuthorBooks(authorId:number){
        const author=await this.authorService.findOne(authorId);
        if(!author){
            throw new NotFoundException('this uathor not exist')
        }
        const authorBooks=await this.BookRepo.find({where:{author:{id:authorId}}});
        return authorBooks;
    }

    
}
