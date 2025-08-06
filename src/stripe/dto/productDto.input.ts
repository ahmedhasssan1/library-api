import {  Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class  ProductData{

  @Field(()=>Int)
  @IsNumber()
  userId:number

}
