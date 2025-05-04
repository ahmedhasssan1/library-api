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

  async createCheckoutSession(cartProduct: ProductData) {
    const userCart = await this.cartServce.getUserCart(cartProduct.userId);
    try{
    const emailToUser=await this.emailService.SendEmail({
      recipienst:[userCart.cart.user.email],
      subject:'ypur checkout sessions',
      html: `<p>Dear ${userCart.cart.user.name},</p>
      <p>Thank you for your purchase. Your checkout session has been created successfully.</p>
      <p>Order Total: $${userCart.cart.totalPrice}</p>`,
      text: `Dear ${userCart.cart.user.name},\n
      Thank you for your purchase. Your checkout session has been created successfully.\n
      Order Total: $${userCart.cart.totalPrice}`,
    })
    console.log('email to user',emailToUser)

  }catch(error){
    console.error('errrot sending email',error)
  }
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
      success_url: "https://res.cloudinary.com/duj5aatpw/image/upload/v1746133937/avatars/1746133935834-oldman.jpg.jpg",
      cancel_url: 'http://localhost:3000/pay/failed/checkout/session', 
      customer_email: cartProduct.customerEmail,
    });
    

    return session.url;
  }
}
