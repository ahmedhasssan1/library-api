import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ProductData } from './dto/productDto.input';
import { CartService } from 'src/cart/cart.service';
import { EmailService } from 'src/email/email.service';

const stripe = new Stripe('sk_test_51RJj4kKKBuv1gV0RqLuVhakDgatKPsUxtKo3AOvnFUEOZDyv4FLxP2zGvAisdxHUiIyLoCJMISXOBP7bnQrXUt0f00fZZWPGmB');

@Injectable()
export class StripeService {
  constructor(private cartServce: CartService,
    private emailService:EmailService
  ) {}

  async createCheckoutSession(cartProduct: ProductData):Promise<{url:string,userCart:any}> {
    const userCart = await this.cartServce.getUserCart(cartProduct.userId);
    // Corrected `line_items` structure
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
      success_url: "https://www.shutterstock.com/image-photo/smartphone-online-payment-hand-hold-260nw-2355579741.jpg",
      cancel_url: 'http://localhost:3000/pay/failed/checkout/session', 
      customer_email: 'ah1589@gmail.com',
    });
    

    return {url:session.url??'',userCart};
  }
}
