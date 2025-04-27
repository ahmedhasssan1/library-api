import { Field, ObjectType } from '@nestjs/graphql';
import { Users } from 'src/users/entity/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Cart'})
@ObjectType()
export class Cart {
  
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @OneToOne(()=>Users,(user)=>user.id,{onDelete:'CASCADE'})
  @JoinColumn()
  @Field()
  user:Users

  @Column({default:0})
  @Field()
  totalPrice: number;

  
  @Column({default:0,nullable:true})
  @Field()
  discount: number;
}
