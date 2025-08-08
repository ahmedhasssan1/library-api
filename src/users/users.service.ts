import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create.input';
import { BookToUserDto } from './dto/bookToUser.input';
import { BooksService } from 'src/books/books.service';
import   * as bcrypt from 'bcrypt'
import { FilService } from 'src/file/file.service';
import { UpdateUserDto } from './dto/updateUser.input';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private userRepo:Repository<Users>,
    private BookService:BooksService,
    private photoUpload:FilService
){}

    async createUser(createUserDto:createUserDto):Promise<Users>{
        const file=createUserDto.file;
        const photoUploaded=await this.photoUpload.uploadImage(file)
        console.log('file',photoUploaded)
        const user=this.userRepo.create({
            name:createUserDto.name,
            email:createUserDto.email,
            contact_info:createUserDto.contact_info,
            password:createUserDto.password,
            photo:photoUploaded
                        
        }        
        )
        console.log('debugging ',user);
        
         user.password=await bcrypt.hash(user.password,10);
         console.log('debugging ',user.password);
         console.log('debugging ',user);

        const savedUser=await this.userRepo.save(user);
        return savedUser;
    }

    async   getUser(id:number):Promise<Users>{
        const user=await this.userRepo.findOne({where:{id},relations:['book']});

        if(!user){
            throw new NotFoundException('this user not exist');
        }
        return user;

    }
    
    async addBookToUser(bookToUser:BookToUserDto):Promise<Users>{
        const user=await this.getUser(bookToUser.userId)
        const book = await this.BookService.findOneBook(bookToUser.BookId);
        if (!book) {
            throw new NotFoundException('this book does not exist');
        }
        user.book.push(book);
        return  await this.userRepo.save(user);


        
    }
    async getAllUsers():Promise<Users[]>{
        const users=await this.userRepo.find({relations:['book']});
        if(!users ||users.length===0){
            throw new NotFoundException('no users exist')
        }        
        return users
    }
    async deleteUSer(userId:number){
        const user=await this.userRepo.findOne({where:{id:userId}});
        if(!user){
            throw new NotFoundException('this user not exist');

        }
        await this.userRepo.delete(userId);
        return true;
    }
    async findUserByEmail(email:string){
        const user=await this.userRepo.findOne({where:{email}});
        if(!user){
            throw new NotFoundException('this user not exist');
        }
        return user
    }
    async updateUser(updateUSer:UpdateUserDto):Promise<Users>{
        const user=await this.userRepo.findOne({where:{id:updateUSer.id}})
        if(!user){
            throw new NotFoundException('this user not exist')
        }
        await this.userRepo.update(updateUSer.id,{...updateUSer});
        
        await this.userRepo.save(updateUSer);
        const updatedUser = await this.userRepo.findOne({ where: { id: updateUSer.id } });
        return updatedUser!;

    }
    





}
