import { Field, ObjectType } from "@nestjs/graphql"
import { CartItem } from "../entity/cartItem.entity"
import { Cart } from "../entity/cart.entity"

@ObjectType()
export class UserCart{
    @Field(()=>[CartItem])
    cartitems:CartItem[]

    @Field()
    cart:Cart
}
