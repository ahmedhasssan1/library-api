import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[ JwtModule.register({
    secret:'123',
    signOptions:{expiresIn:'2h'},
  }),
    UsersModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
