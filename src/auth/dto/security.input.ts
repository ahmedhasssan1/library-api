import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class securityDto{
    
    // @Field()
    // name:string

    @Field()
    email:string

    @Field()
    password:string
}