import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { BooksModule } from 'src/books/books.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports:[TypeOrmModule.forFeature([Users]),BooksModule,FileModule],
  providers: [UsersResolver, UsersService],
  exports:[UsersService]
})
export class UsersModule {}
