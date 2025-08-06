import { ObjectType, Field } from '@nestjs/graphql';
import {  IsString } from 'class-validator';

@ObjectType()
export class SessionStatusResponse {
  @Field()
  @IsString()
  status: string ;

  @Field()
  @IsString()
  customer_email: string ;
}
