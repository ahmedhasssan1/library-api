import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { ProductData } from './dto/productDto.input';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => String)
  checkout(@Args('productdata')productdata:ProductData) {
    return  this.stripeService.createCheckoutSession(productdata);
  }
}
