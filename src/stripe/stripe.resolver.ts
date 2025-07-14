import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { ProductData } from './dto/productDto.input';
import { EmailService } from 'src/email/email.service';
import { RawBodyRequest, Req } from '@nestjs/common';
import { SessionStatusResponse } from './dto/SessionStatusResponse.dto';

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
  @Query(()=>SessionStatusResponse)
     async sessionStatus(@Args('session_id') sessionId: string) {
      try{
        const session=await this.stripeService.getSessionStatus(sessionId);
        return session
      }catch(error){{
        return{
          status:'',
          customer_email:''
        }
      }}
  }
}

