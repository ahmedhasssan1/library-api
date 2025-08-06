import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { ProductData } from './dto/productDto.input';
import { EmailService } from 'src/email/email.service';
import { RawBodyRequest, Req } from '@nestjs/common';
import {  SessionStatusResult } from './dto/sessionRes.dto';
import { RefundDto } from './dto/refund.dto';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService,
    private emailService:EmailService
  ) {}

  @Mutation(() => String)
  async checkout(@Args('productdata')productdata:ProductData,@Req() req:RawBodyRequest<Request> ) {
    const {url}=await this.stripeService.createCheckoutSession(productdata);
    return url;
  }
  @Query(()=>SessionStatusResult)
  async getSessionRes(@Args('sessionId')session_Id:string){
    return this.stripeService.getSessionStatus(session_Id);
  }
  @Mutation(()=>String)
  async Refund(@Args('RefundData')chargeID:string){
    return await this.stripeService.refund(chargeID) 
  }
}

