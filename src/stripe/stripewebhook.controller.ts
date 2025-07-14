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
const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET || 'whsec_a4f682f1ee21669c04d63cf9277b962ac221e8d5cfb491b8243c75565514e4e8', {
    apiVersion: '2025-04-30.basil' as any, 

});

@Controller('webhook')
export class StripeWebhookController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      const rawBody = req.body as Buffer;
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET ||'whsec_a4f682f1ee21669c04d63cf9277b962ac221e8d5cfb491b8243c75565514e4e8',
      );
    } catch (err) {
      console.error(' Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🎯 Handle specific events
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
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

    if (email) {
      await this.emailService.SendEmail({
        recipienst: [email],
        subject: ' Payment Completed this from webhook',
        html: `<p>Thank you! Your payment of $${amount} was successful.</p>`,
        text: `Thank you! Your payment of $${amount} was successful.`,
      });
    }

    console.log(' checkout.session.completed for', email);
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
