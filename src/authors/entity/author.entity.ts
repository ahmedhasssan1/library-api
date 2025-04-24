import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Books } from "src/books/entity/books.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class authors{
    
    @PrimaryGeneratedColumn()
    @Field((type)=>Int)
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
    
    @OneToMany(()=>Books,books=>books.author)
    @Field(type=>[Books],{nullable:true})
    books:Books[];


}