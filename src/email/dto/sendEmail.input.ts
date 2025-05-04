import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, isEmail, IsOptional, IsString, isString } from "class-validator";

@InputType()
export class Sendemaildto{


    @IsEmail({},{each:true})
    @Field(()=>[String])
    recipienst:string[];

    @IsString()
    @Field()
    subject:string


    @IsString()
    @Field()

    html:string

    @IsOptional()
    @IsString()
    @Field()
    text?:string
}