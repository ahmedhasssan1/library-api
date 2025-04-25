import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authors } from './entity/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/createAuthor.input';
import { updateAuthorDto } from './dto/updateAuthor.input';
import { BooksService } from 'src/books/books.service';
import { Books } from 'src/books/entity/books.entity';

@Injectable()
export class AuthorsService {
    constructor(@InjectRepository(authors) private authorsRepo:Repository<authors>,
    @InjectRepository(Books) private bookRepo:Repository<Books>,
    // private BookService:BooksService
){}
    
    async createAutho(CreateAuthor:CreateAuthorDto):Promise<authors>{
    
        const newAuthor=this.authorsRepo.create(CreateAuthor);
        return this.authorsRepo.save(newAuthor);
    }

    
    async findallAuthors():Promise<authors[]>{
        return this.authorsRepo.find();

    }

    async findOne(id:number):Promise<authors>{
        return this.authorsRepo.findOneOrFail({where:{id},relations:['books']});
    }

    async updateAuthor(updateAuthor:updateAuthorDto):Promise<authors>{
        await this.authorsRepo.update(updateAuthor.id,{...updateAuthor});
        const updatedAuthor=await this.authorsRepo.findOne({where:{id:updateAuthor.id}})
        if (!updatedAuthor) {
            throw new NotFoundException('Author not found after update');
        } 
        return updatedAuthor;
    }

    async AllauthorBooks(authorId:number){
        const auhtorsBooks=await this.authorsRepo.findOne({where:{id:authorId}})
        if(!auhtorsBooks){
            throw new NotFoundException('this authoe not exist')
        }
        const auhtorBooks=await this.bookRepo.find({where:{author:{id:authorId}}});
        return auhtorBooks;


    }
}
