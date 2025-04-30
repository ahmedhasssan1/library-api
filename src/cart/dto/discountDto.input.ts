import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class DiscountDto{
    
    @Field(()=>Int)
    discount:number

    @Field(()=>Int)
    userId:number   

}
