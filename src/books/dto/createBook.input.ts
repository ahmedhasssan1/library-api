import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import  * as GraphQLUpload  from 'graphql-upload/GraphQLUpload.js'; 
import { FileUpload } from "src/common/interfaces/file-upload.interface";

@InputType()
export class createBookdto{
    

    @Field()
    name:string

    @Field(()=>Int,{nullable:true})
    @IsOptional()
    authorID:number
    
    @Field()
    price:number

    @Field()
    description:string

    @IsOptional()
    @Field({nullable:true})
    published_at:Date
    
    @IsOptional()
    @Field(() => GraphQLUpload, { nullable: true })
    photo?: Promise<FileUpload>;

}