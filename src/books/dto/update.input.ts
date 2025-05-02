import { Field, InputType, Int } from '@nestjs/graphql';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class updateDto {
  @Field(() => Int, { nullable: true })
  id: number;

  // @Field({nullable:true})
  // name:string

  // @Field({nullable:true})
  // discription:string

  @Field(() => GraphQLUpload)
  photo: Promise<FileUpload>;
}
