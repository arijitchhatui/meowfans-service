import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class GetPostInput {
  @Field()
  @Column()
  @IsNotEmpty()
  postId: string;
}
