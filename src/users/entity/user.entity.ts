import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Books } from "src/books/entity/books.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Users{

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @Field()
    name:string

    @Column()
    @Field()
    contact_info:string

    @Column()
    @Field()
    email:string

    @Column()
    @Field()
    password:string

    @OneToMany(()=>Books,(book)=>book.user,{onDelete:'SET NULL'})
    
    @Field(()=>[Books],{nullable:true})
    book:Books[]

    // @OneToOne(() => Cart, (cart) => cart.user)
    // @Field(() => Cart, { nullable: true })
    // cart?: Cart;




}