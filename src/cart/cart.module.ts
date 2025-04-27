import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cartItem.entity';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,CartItem]),UsersModule,BooksModule],
  providers: [CartResolver, CartService],
})
export class CartModule {}
