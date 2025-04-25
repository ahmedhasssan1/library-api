import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class updateAuthorDto{

    @Field()
    id:number
    
    @Field()
    name:string

    @Field()
    info:string


}