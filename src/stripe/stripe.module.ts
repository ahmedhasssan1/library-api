import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartModule } from 'src/cart/cart.module';
import { EmailModule } from 'src/email/email.module';
import { StripeWebhookController } from './stripewebhook.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers:[StripeWebhookController],
  imports:[CartModule,EmailModule,UsersModule],
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
