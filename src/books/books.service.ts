import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from './entity/books.entity';
import { Repository } from 'typeorm';
import { createBookdto } from './dto/createBook.input';
import { AuthorsService } from 'src/authors/authors.service';
import { authors } from 'src/authors/entity/author.entity';
import { updateDto } from './dto/update.input';
import { FilService } from 'src/file/file.service';
import { UpdateBookDto } from './dto/updateBook.input';

@Injectable()
export class    BooksService {
    constructor(@InjectRepository(Books) private BookRepo:Repository<Books>,
    private authorService:AuthorsService,
    private fileService:FilService

){}

    async findOneBook(id:number):Promise<Books>{
        const book=await this.BookRepo.findOne({where:{id}})
        if(!book){
            throw new NotFoundException('this book not exist')
        }
        return book;
    }

    async CreateBook( createbook:createBookdto):Promise<Books>{
        
        const findAuthor=await this.authorService.findOne(createbook.authorID);
        if(!findAuthor){
            throw new NotFoundException('this author not exist');
        }
        const createBook=this.BookRepo.create({
            name:createbook.name,
            author:findAuthor,
            price:createbook.price,
            discription:createbook.description,
            published_at:createbook.published_at
            
        }
        )
        // console.log('debugging ',createBook);
        

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

    async uploadPhotoBook(updateBook:updateDto):Promise<Books>{
        
        const file=updateBook.photo;

        const photoloaded = await this.fileService.uploadImage(file);
      
        const findbookupdated=await this.BookRepo.findOne({where:{id:updateBook.id}});

        if(!findbookupdated){
            throw new NotFoundException('this book not existing any more')
        }
        findbookupdated.photo=photoloaded
        await this.BookRepo.save(findbookupdated)
        return findbookupdated;
    }



    async uppdateBook(updateBook:UpdateBookDto){
        const Book=await this.BookRepo.findOne({where:{id:updateBook.id}})
        if(!Book){
            throw new NotFoundException('this book not found')
        }
        const{id,...resDate}=updateBook;
        await this.BookRepo.update(id,resDate)
        return await this.BookRepo.save(updateBook)

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
