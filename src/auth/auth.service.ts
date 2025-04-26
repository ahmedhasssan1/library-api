import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { securityDto } from './dto/security.input';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { tokenDto } from './dto/access_tokent.input';

@Injectable()
export class AuthService {
    constructor(private userService:UsersService,
        private jwtService:JwtService
    ){}
    async signIn(jwtDto:securityDto):Promise<tokenDto>{
        const user=await this.userService.findUserByEmail(jwtDto.email);
        if(!user){
            throw new NotFoundException('this user not exist');
        }
        if(user?.password!==user.password){
            throw new UnauthorizedException('wrong password');
        }

        
        const isMatch=await bcrypt.compare(jwtDto.password,user.password);
        if(!isMatch){
            throw new UnauthorizedException('correct password');
        }
        console.log('debugging ',isMatch);

        const {password,...res}=user;
        const payload={sub:user.id,email:user.email}
        return{
            access_token:await this.jwtService.signAsync(payload)
        }
        
        
    }
}
