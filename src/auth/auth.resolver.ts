import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { securityDto } from './dto/security.input';
import { tokenDto } from './dto/access_tokent.input';




@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(()=>tokenDto)
  signIn(@Args('login')jwtDto:securityDto):Promise<tokenDto>{
    return this.authService.signIn(jwtDto)
  }

}
