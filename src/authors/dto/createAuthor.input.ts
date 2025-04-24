import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class CreateAuthorDto{
    @Field()
    name:string

    @Field()
    info:string

    @Field({nullable:true})
    age:number

}