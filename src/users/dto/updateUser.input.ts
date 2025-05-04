import { Field, InputType, Int } from "@nestjs/graphql";
import { IsEmail, IsOptional } from "class-validator";

@InputType()
export class UpdateUserDto{

    @Field(()=>Int)
    id:number


    @IsOptional()
    @Field({nullable:true})
    name?:string

    @IsOptional()
    @IsEmail()
    @Field()
    email?:string

}