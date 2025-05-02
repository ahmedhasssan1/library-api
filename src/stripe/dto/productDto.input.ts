import {  Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { int } from 'aws-sdk/clients/datapipeline';

@InputType()
export class  ProductData{

  // @Field()
  // name:string

  // @Field(()=>Int)
  // userId:number

  // @Field(() => Int)
  // unitAmount: number;

  // @Field(() => Int)
  // quantity: number;
  
  // @Field()
  // photo:string

  // @Field()
  // description:string
  @Field(()=>Int)
  userId:number
  
  @Field()
  customerEmail:string

}
