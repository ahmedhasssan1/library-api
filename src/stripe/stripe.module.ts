import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartModule } from 'src/cart/cart.module';
import { EmailModule } from 'src/email/email.module';
import { StripeWebhookController } from './stripewebhook.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers:[StripeWebhookController],
  imports:[CartModule,EmailModule],
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
