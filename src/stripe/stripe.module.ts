import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports:[CartModule],
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
