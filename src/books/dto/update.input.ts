import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class updateDto{

    @Field()
    id:number

    @Field()
    name:string

}