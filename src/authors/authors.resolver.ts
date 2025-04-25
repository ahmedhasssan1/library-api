import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { authors } from './entity/author.entity';
import { CreateAuthorDto } from './dto/createAuthor.input';
import { updateAuthorDto } from './dto/updateAuthor.input';

@Resolver(()=>authors)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Query(()=>authors)
  findOneAuthor(@Args('id',{type:()=>Int})id:number){
    return this.authorsService.findOne(id)
  }


  @Query(()=>[authors])
  authors():Promise<authors[]>{
    return this.authorsService.findallAuthors()
  }

  @Mutation(()=>authors)
  CreateAuthor(@Args('CreateAuthor') CreateInput:CreateAuthorDto):Promise<authors>{
    return this.authorsService.createAutho(CreateInput)

  }

  @Mutation(()=>authors)
  updateAuthor(@Args('updateAuthor')updateAuthorDto:updateAuthorDto):Promise<authors>{
    return this.authorsService.updateAuthor(updateAuthorDto);
  }
  




}
