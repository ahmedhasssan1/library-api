import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authors } from './entity/author.entity';

@Module({
  imports:[TypeOrmModule.forFeature([authors])],
  providers: [AuthorsResolver, AuthorsService],
  exports:[AuthorsService]
})
export class AuthorsModule {}
