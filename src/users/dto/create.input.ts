import { Field, InputType } from "@nestjs/graphql";
import  * as GraphQLUpload  from 'graphql-upload/GraphQLUpload.js'; 
import { FileUpload } from "src/common/interfaces/file-upload.interface";

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


    @Field(()=>GraphQLUpload)
    file:Promise<FileUpload>
    
    

}