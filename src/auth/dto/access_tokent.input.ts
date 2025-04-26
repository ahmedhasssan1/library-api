import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class tokenDto{
    @Field()
    access_token:string
}