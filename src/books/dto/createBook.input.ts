import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class createBookdto{
    

    @Field()
    name:string

    @Field(()=>Int,{nullable:true})
    @IsOptional()
    authorID:number
    
    @Field()
    price:number
}