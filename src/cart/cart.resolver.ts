import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cartItem.entity';
import { bookToCartItemDto } from './dto/addbookToUserCart.input';
import { UserCart } from './dto/UserCart.input';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(()=>Cart)
  createcart(@Args('userId',{type:()=>Int})userId:number):Promise<Cart>{
    return  this.cartService.createCart(userId)
  }
  @Query(()=>[Cart])
  getallCarts(){
    return this.cartService.findAllCarts();
  }

  @Mutation(()=>CartItem)
  addCartItem(@Args('addBookIDAndUserId')creatCartItemDto:bookToCartItemDto):Promise<CartItem>{
    return this.cartService.addBookToUserCart(creatCartItemDto);
  }

  @Query(()=>UserCart)
  getUserCart(@Args('userId',{type:()=>Int}) userId:number):Promise<UserCart>{
    return this.cartService.getUserCart(userId)

  }

  @Mutation(()=>Boolean)
  deleteBook(@Args('bookIDAndUSerId')bookAndUserID:bookToCartItemDto){
    return this.cartService.deleteBook(bookAndUserID);
  }


}
