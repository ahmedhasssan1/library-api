import { Field, InputType } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";

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