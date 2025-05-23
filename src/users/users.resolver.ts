import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create.input';
import { Users } from './entity/user.entity';
import { BookToUserDto } from './dto/bookToUser.input';
import { UpdateUserDto } from './dto/updateUser.input';
import { throws } from 'assert';


@Resolver(()=>Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(()=>Users)
  getUser(@Args('getuserById',{type:()=>Int})id:number):Promise<Users>{
    return this.usersService.getUser(id);
  }

  @Mutation(()=>Users)
  createUser(@Args('createUser')createUser:createUserDto){
  return this.usersService.createUser(createUser)
  }

  @Mutation(()=>Users)
  addBookToUser(@Args('bookToUser')BookToUser:BookToUserDto):Promise<Users>{
    return this.usersService.addBookToUser(BookToUser)
  }
  @Query(()=>[Users])
  getAllUsers():Promise<Users[]>{
    return this.usersService.getAllUsers();
  }
  @Mutation(()=>Boolean)
  deleteUser(@Args('userId',{type:()=>Int})Id:number){
    return this.usersService.deleteUSer(Id)

  }

  @Mutation(()=>Users)
  updateUser(@Args('updateUser')updateUser:UpdateUserDto):Promise<Users>{
    return this.usersService.updateUser(updateUser)
  }

    
}
