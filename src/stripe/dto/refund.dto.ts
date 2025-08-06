// refund.dto.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RefundDto {
  @Field()
  charge_id: string;

  @Field({ nullable: true })
  amount?: number;


}
