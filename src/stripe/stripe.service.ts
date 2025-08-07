import { Injectable, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { ProductData } from './dto/productDto.input';
import { CartService } from 'src/cart/cart.service';
import { EmailService } from 'src/email/email.service';
import { RefundDto } from './dto/refund.dto';
import { ref } from 'process';
import * as dotenv from 'dotenv';
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// const refund=stripe.refunds.create({
//   charge:
// })

@Injectable()
export class StripeService {
  constructor(private cartServce: CartService,
    private emailService:EmailService
  ) {}

  async createCheckoutSession(cartProduct: ProductData):Promise<{url:string,userCart:any}> {
    const userCart = await this.cartServce.getUserCart(cartProduct.userId);
    const session = await stripe.checkout.sessions.create({

      line_items: userCart.cartitems.map((prod) => ({
        price_data: {
          currency: 'usd',
          unit_amount: prod.book.price * 100,
          product_data: {
            name: prod.book.name, 
            description: prod.book.discription,
            images: [prod.book.photo], 
          },
        },
        
        quantity: prod.quantit, 
      })),
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      billing_address_collection:'required',
      automatic_tax:{enabled:false},
      
      shipping_address_collection:{
        allowed_countries:['US','CA','EG',]
      },
      tax_id_collection: { enabled: false },
      shipping_options:[
        {
            shipping_rate_data:{
              type:'fixed_amount',
              fixed_amount:{
                amount:userCart.cart.totalPrice,
                currency:'usd'
              },
              display_name:'USPS First Class Mail',
              delivery_estimate:{
                minimum:{
                  unit:'business_day',
                  value:2
                },
                maximum:{
                  unit:'business_day',
                  value:5
                }
              }
            }
        }
      ],
      
      

      // return_url: `http://localhost:3000/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://sterling-adversely-mink.ngrok-free.app/pay/failed/checkout/session',
      success_url: 'https://sterling-adversely-mink.ngrok-free.app/success',

      customer_email: userCart.cart.user.email,
    });
      
    // const paymentMethodDomain = await stripe.paymentMethodDomains.create({
    //     domain_name: 'checkout.stripe.com',
    // })
    console.log("session id :",session.id);

    return {url:session.url??'',userCart};
  }
  async getSessionStatus(session_id: string) {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent'],
    });

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;

    if (!paymentIntent || !paymentIntent.latest_charge) {
      return {
        charge_id: null,
        status: session.status,
        customer_email: session.customer_details?.email,
        amount_total: (session.amount_total ?? 0) / 100,

        message: 'No charge found for this session.',
      };
    }

    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);

    return {
      charge_id: charge.id,
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_total: (session.amount_total ?? 0) / 100,
    };
  }
  // stripe.service.ts
  async refund(charge_id:string): Promise<string> {
    console.log('Refunding charge:', charge_id);

    const refund = await stripe.refunds.create({
      charge: charge_id,
      amount: 20000, // optional for partial refund
      reason: "requested_by_customer"
    });

    return `Refund of $${(refund.amount / 100).toFixed(2)} successful. Refund ID: ${refund.id}, ${refund.status}`;
  }
  async PaymentMethod(customerId){
    const setupintent=await stripe.setupIntents.create({
      customer:customerId,
      payment_method_types:['card']
    })
  }



}
