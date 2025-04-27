import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class bookToCartItemDto{
    @Field(()=>Int)
    userId:number

    @Field(()=>Int)
    bookId:number

    
}