import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authors } from './entity/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/createAuthor.input';

@Injectable()
export class AuthorsService {
    constructor(@InjectRepository(authors) private authorsRepo:Repository<authors>){}
    
    async createAutho(CreateAuthor:CreateAuthorDto):Promise<authors>{
    
        const newAuthor=this.authorsRepo.create(CreateAuthor);
        return this.authorsRepo.save(newAuthor);
    }

    
    async findallAuthors():Promise<authors[]>{
        return this.authorsRepo.find();

    }

    async   findOne(id:number):Promise<authors>{
        return this.authorsRepo.findOneOrFail({where:{id}});
    }
}
