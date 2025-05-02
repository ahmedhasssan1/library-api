import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create.input';
import { Users } from './entity/user.entity';
import { BookToUserDto } from './dto/bookToUser.input';


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
  // @Mutation(() => String)
  // async uploadPhotowithUSer(
  //   @Args('file', { type: () => GraphQLUpload }) file: Promise<FileUpload>
  // ) {
  //   const { filename, createReadStream,mimetype,encoding } = await file;
  //   console.log(file)
  //   if (!filename) {
  //     throw new NotFoundException('No photo uploaded');
  //   }
  
  //   // save the file...
  //   return `Photo uploaded successfully`;
  // }
    
}
