import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class createUserDto{
    @Field()
    name:string
    
    @Field()
    contact_info:string

    @Field()
    email:string

    @Field()
    password:string


}