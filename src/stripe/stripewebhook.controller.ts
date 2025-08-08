import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,)

@Controller('webhook')
export class StripeWebhookController {
  constructor(private readonly emailService: EmailService,
    private readonly configservice:ConfigService,
    private readonly StripeService:StripeService,
    private readonly userService:UsersService

  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      // const sig=req.headers['strip']
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
         process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err) {
      console.error(' Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    //  Handle specific events
    switch (event.type) {
    case 'checkout.session.completed':
        console.log(' Received checkout.session.completed');

          const session = event.data.object;  
          const userId = session.metadata?.userId;
          const topupAmount = Number(session.metadata?.topupAmount);
          console.log('debugging ',session);
          
          if (userId && topupAmount) {
            const user = await this.userService.getUser(Number(userId));

            const newBalance = (user.walletBalance || 0) + topupAmount;
            
            console.log(`User ${userId} topped up ${topupAmount}. New balance: ${newBalance} `);
            await this.userService.updateUser({
              id: Number(userId),
              walletBalance: newBalance
            });

          }
        break;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(` Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const email = session.customer_details?.email;
    const amount = (session.amount_total ?? 0) / 100;
    const fullSession=await stripe.checkout.sessions.retrieve(session.id,{
      expand:['payment_intent', 'payment_intent.charges']
    })
    const paymentIntent = fullSession.payment_intent as Stripe.PaymentIntent & {
    charges: { data: Stripe.Charge[] };
  };
  const chargeId = paymentIntent?.charges?.data?.[0]?.id;

    if (email) {
      await this.emailService.SendEmail({
        recipienst: [email],
        subject: ' Payment Completed this from webhook',
        html: `<p>Thank you! Your payment of $${amount} was successful.</p>`,
        text: `Thank you! Your payment of $${amount} was successful.`,
      });
    }

    console.log(' checkout.session.completed for', email);
    console.log(' chargeID', chargeId);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const email = invoice.customer_email;
    const amount = (invoice.amount_paid ?? 0) / 100;

    if (email) {
      await this.emailService.SendEmail({
        recipienst: [email],
        subject: ' Invoice Paid',
        html: `<p>Your invoice of $${amount} has been paid. Thank you!</p>`,
        text: `Your invoice of $${amount} has been paid. Thank you!`,
      });
    }

    console.log(' invoice.paid for', email);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const email = invoice.customer_email;

    if (email) {
      await this.emailService.SendEmail({
        recipienst: [email],
        subject: ' Invoice Payment Failed',
        html: `<p>Unfortunately, your invoice payment failed. Please update your payment method.</p>`,
        text: `Your invoice payment failed. Please update your payment method.`,
      });
    }

    console.log(' invoice.payment_failed for', email);
  }
}
