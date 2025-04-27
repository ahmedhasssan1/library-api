import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Books } from "src/books/entity/books.entity";
import { Cart } from "src/cart/entity/cart.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class CartItem{

    @PrimaryGeneratedColumn()
    @Field(()=>Int)
    id:number

    @ManyToOne(()=>Cart,(cart)=>cart.id,{onDelete:'CASCADE'})
    @JoinColumn()
    @Field(()=>Cart)
    cart:Cart

    @ManyToOne(()=>Books,(book)=>book.id,{onDelete:'SET NULL'})
    @JoinColumn()
    @Field(()=>Books)
    book:Books

    @Column()
    @Field()
    bookPrice:number
    
    @Column()
    @Field()
    bookName:string  

    @Column({default:1})
    @Field(()=>Int)
    quantit:number
    
    

}








