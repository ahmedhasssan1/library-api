import { Field, Int, ObjectType } from "@nestjs/graphql";
import { authors } from "src/authors/entity/author.entity";
import { Users } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Books{
    
    @PrimaryGeneratedColumn()
    @Field(()=>Int)
    id:number

    @Column()
    @Field()
    name:string

    @ManyToOne(()=>authors,author=>author.books,{onDelete:'CASCADE'})
    @JoinColumn()
    @Field(()=>authors,{nullable:true})
    author:authors


    @ManyToOne(()=>Users,(user)=>user.book)
    @Field(()=>Users)
    user:Users
}