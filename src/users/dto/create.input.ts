import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";
import  * as GraphQLUpload  from 'graphql-upload/GraphQLUpload.js'; 
import { FileUpload } from "src/common/interfaces/file-upload.interface";

@InputType()
export class createUserDto{
    @Field()
    @IsString()
    name:string
    
    @Field()
    @IsString()
    contact_info:string

    @Field()
    @IsEmail()
    email:string

    @Field()
    @IsString()
    password:string


    @Field(()=>GraphQLUpload)
    file:Promise<FileUpload>
    
    

}