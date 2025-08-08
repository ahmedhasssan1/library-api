import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TopupDto{
    @Field(()=>Number)
    userId:number

    @Field(()=>Number)
    amount:number

}