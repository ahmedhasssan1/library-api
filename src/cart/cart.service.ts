import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { bookToCartItemDto } from './dto/addbookToUserCart.input';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { CartItem } from './entity/cartItem.entity';
import { UserCart } from './dto/UserCart.input';
import { DiscountDto } from './dto/discountDto.input';
import { find } from 'rxjs';

@Injectable()
export class CartService {
constructor(@InjectRepository(Cart) private CartRepo:Repository<Cart>,
@InjectRepository(CartItem) private CartItemRepo:Repository<CartItem>,
    private  userService:UsersService,
    private  bookService:BooksService
){}

async createCart(userId:number,discount:number):Promise<Cart>{
    const  findUserCart=await this.CartRepo.findOne({where:{user:{id:userId}},relations:['user']})
    if(findUserCart){
        return findUserCart;
    }
    const createCart=this.CartRepo.create({user:{id:userId},discount})
    return await this.CartRepo.save(createCart);
    
}
async findAllCarts(){
    const allCarts=await this.CartRepo.find({relations:['user']});
    if(!allCarts){
        throw new NotFoundException("no carts exist");
    }
    return allCarts;
}
async addBookToUserCart(booktoCart:bookToCartItemDto):Promise<CartItem>{
    const finduser=await this.userService.getUser(booktoCart.userId);
    if(!finduser){
        throw new NotFoundException("this user not  exist");
    }
    const findBook=await  this.bookService.findOneBook(booktoCart.bookId);
    if(!findBook){
        throw new NotFoundException('this book not  exist');
    }
    let findCart=await this.CartRepo.findOne({where:{user:{id:booktoCart.userId}},
        relations:['user']
    })
    if(!findCart){
        findCart=await this.createCart(booktoCart.userId,0);
    }
    const UsercartItem=await this.CartItemRepo.findOne({where:
        {
            cart:{id:findCart.id},
            book:{id:booktoCart.bookId}
        },
        relations:['book','cart']});

   
    findCart.totalPrice+=findBook.price;
  
    await this.CartRepo.save(findCart);

    if(UsercartItem?.book.id===booktoCart.bookId){
        UsercartItem.quantit++;
       return await this.CartItemRepo.save(UsercartItem);
    }
    
    const createCartItem=this.CartItemRepo.create({
        book:findBook,
        cart:findCart,
        bookPrice:findBook.price,
        bookName:findBook.name
    })
    
    return await this.CartItemRepo.save(createCartItem);

}

async getUserCart(userId:number):Promise<UserCart>{
    const findCart=await this.CartRepo.findOne({where:{user:{id:userId}}});
    const findCartItem=await this.CartItemRepo.find({where:{cart:{user:{id:userId}}},relations:['book']})

    if(!findCart){
        throw new NotFoundException("this user do not have cart")
    }
    if(findCart.discount>0){

        findCart.totalPrice-=(findCart.totalPrice*(findCart.discount/100))

    }
    return {
        cart:findCart,
        cartitems:findCartItem
    };
}
async decreaseQuantityofBook(bookIDAndUserID:bookToCartItemDto){
    const user=await this.userService.getUser(bookIDAndUserID.userId);
    if(!user){
        throw new NotFoundException('this user not exist')
    }
    const findCart=await this.CartRepo.findOne({where:{user:{id:bookIDAndUserID.userId}}});
    if(!findCart){
        throw new NotFoundException("this user cart not exist")
    }
    let cartitem=await this.CartItemRepo.findOne({
        where:
        {
            cart:{id:findCart.id},
            book:{id:bookIDAndUserID.bookId}
        },
        relations:['book']});

    
    if(!cartitem){
            throw new NotFoundException("this book not exist");
    }

    findCart.totalPrice-=cartitem.book.price;
    if (findCart.totalPrice<0){
        findCart.totalPrice=0;
    }
    await this.CartRepo.save(findCart);
    cartitem.quantit--;
    if(cartitem.quantit<=0){
        await this.CartItemRepo.remove(cartitem);
    }else{
         await this.CartItemRepo.save(cartitem);
    }
    return true;

}
async deleteBook(bookIDAndUser:bookToCartItemDto){
    const user= await this.userService.getUser(bookIDAndUser.userId);
    if(!user){
        throw new NotFoundException('this user not exist')
    }
    const cart=await this.CartRepo.findOne({where:{user:{id:bookIDAndUser.userId}}});
    if(!cart){
        throw new NotFoundException("this cart not exist")
    }
    const cartitem=await this.CartItemRepo.findOne({where:{book:{id:bookIDAndUser.bookId}}});
    if(!cartitem){
        throw new NotFoundException('this cartitem not exist');
    }
    if(cart.discount>0){

        cart.totalPrice-=(cartitem.bookPrice*cartitem.quantit)/(cart.discount*100);
    }
    if(cart.totalPrice<0){
        cart.totalPrice=0;
    }
    await this.CartItemRepo.remove(cartitem)
    const deletedItem= await this.CartRepo.save(cart);
    if(deletedItem){
        return true
    }
    return false;
}
async updateDiscount(updateDicount:DiscountDto):Promise<string>{
    const user=await this.userService.getUser(updateDicount.userId);
    if(!user){
        throw new NotFoundException("this user not exist")
    }
    const userCart=await this.CartRepo.findOne({where:{user:{id:updateDicount.userId}}})
    if(!userCart){
        await this.createCart(updateDicount.userId,updateDicount.discount);
        
    }
    userCart!.discount=updateDicount.discount;
    await this.CartRepo.save(userCart!)
    return `discount fir user id ${user.id} has been updated to ${updateDicount.discount}`;

    
}



}
