import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Books } from "src/books/entity/books.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class authors{
    
    @PrimaryGeneratedColumn()
    @Field(()=>Int)
    id:number

    @Column()
    @Field()
    name:string

    @Column()
    @Field()
    info:string
    
    @Column({nullable:true})
    @Field({nullable:true})
    age?:number
    
    @OneToMany(()=>Books,books=>books.author,{onDelete:'SET NULL'})
    @Field(()=>[Books],{nullable:true})
    books:Books[];


}