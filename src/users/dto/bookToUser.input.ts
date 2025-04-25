import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class BookToUserDto{
    @Field(()=>Int)
    userId:number

    @Field(()=>Int)
    BookId:number

}