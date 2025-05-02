import { Field, InputType, Int } from "@nestjs/graphql";


@InputType()
export class UpdateBookDto{
    @Field(()=>Int)
    id:number

    @Field({nullable:true})
    name:string

    @Field({nullable:true})
    discription:string
}