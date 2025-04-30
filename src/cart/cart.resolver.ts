import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cartItem.entity';
import { bookToCartItemDto } from './dto/addbookToUserCart.input';
import { UserCart } from './dto/UserCart.input';
import { DiscountDto } from './dto/discountDto.input';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(()=>Cart)
  createcart(@Args('userId',{type:()=>Int})userId:number,@Args('discount',{type:()=>Int})discount:number):Promise<Cart>{
    return  this.cartService.createCart(userId,discount)
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
  decreaseQuantity(@Args('bookIDAndUserId')bookAndUserID:bookToCartItemDto){
    return this.cartService.decreaseQuantityofBook(bookAndUserID);
  }

  @Mutation(()=>Boolean)
  deletecartItem(@Args('bookIdAndUserId')userIdAndBookId:bookToCartItemDto){
    return this.cartService.deleteBook(userIdAndBookId)
  }
  @Mutation(()=>String)
  updateDiscount(@Args('updateDiscount')discountDto:DiscountDto):Promise<string>{
    return this.cartService.updateDiscount(discountDto)

  }


}
