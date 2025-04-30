import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import  * as GraphQLUpload  from 'graphql-upload/GraphQLUpload.js'; 
import { FileUpload } from "src/common/interfaces/file-upload.interface";

@InputType()
export class uploadPhotoDto{

        
    @Field({nullable:true})
    @IsOptional()
    name:string


    @IsOptional()
    @Field({nullable:true})
    contact_info:string

    @IsOptional()
    @Field({nullable:true})

    email:string

    @IsOptional()
    @Field({nullable:true})
    password:string

    
    @Field(()=>GraphQLUpload)
    file:Promise<FileUpload>


}