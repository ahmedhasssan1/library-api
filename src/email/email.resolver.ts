import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EmailService } from './email.service';
import { Sendemaildto } from './dto/sendEmail.input';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailService,
  ) {}

  @Mutation(()=>String)
  sendemail(@Args('seendEmailDto')EmailDto:Sendemaildto){
    return this.emailService.SendEmail(EmailDto);
    
  }
}
