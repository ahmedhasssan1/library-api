import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { bookToCartItemDto } from './dto/addbookToUserCart.input';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { CartItem } from './entity/cartItem.entity';
import { UserCart } from './dto/UserCart.input';

@Injectable()
export class CartService {
constructor(@InjectRepository(Cart) private CartRepo:Repository<Cart>,
@InjectRepository(CartItem) private CartItemRepo:Repository<CartItem>,
    private  userService:UsersService,
    private  bookService:BooksService
){}

async createCart(userId:number):Promise<Cart>{
    const  findUserCart=await this.CartRepo.findOne({where:{user:{id:userId}},relations:['user']})
    if(findUserCart){
        return findUserCart;
    }
    const createCart=this.CartRepo.create({user:{id:userId}})
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
        findCart=await this.createCart(booktoCart.userId);
    }
    const UsercartItem=await this.CartItemRepo.findOne({where:
        {
            cart:{id:findCart.id},
            book:{id:booktoCart.bookId}
        },
        relations:['book','cart']});

   
    findCart.totalPrice+=findBook.price;
    if(findCart.discount>0){
        findCart.totalPrice=findCart.totalPrice*(findCart.discount%100)
    }
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
    return {
        cart:findCart,
        cartitems:findCartItem
    };
}
async deleteBook(bookIDAndUserID:bookToCartItemDto){
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
    await this.CartRepo.save(findCart);
    cartitem.quantit--;
    if(cartitem.quantit<=0){
        await this.CartItemRepo.remove(cartitem);
    }else{
         await this.CartItemRepo.save(cartitem);
    }
    return true;

    

}



}
