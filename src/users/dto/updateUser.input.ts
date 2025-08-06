import { Field, InputType, Int } from "@nestjs/graphql";
import { IsEmail, IsNumber, IsOptional } from "class-validator";

@InputType()
export class UpdateUserDto{

    @Field(()=>Int)
    @IsNumber()
    id:number


    @IsOptional()
    @Field({nullable:true})
    name?:string

    @IsOptional()
    @IsEmail()
    @Field()
    email?:string

}