import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { ProductData } from './dto/productDto.input';
import { EmailService } from 'src/email/email.service';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService,
    private emailService:EmailService
  ) {}

  @Mutation(() => String)
  async checkout(@Args('productdata')productdata:ProductData) {
    const {url,userCart}=await this.stripeService.createCheckoutSession(productdata);

    try{
      const emailToUser=await this.emailService.SendEmail({
        recipienst:[userCart.cart.user.email],
        subject:'your  checkout sessions',
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
  return url;
  }
}
