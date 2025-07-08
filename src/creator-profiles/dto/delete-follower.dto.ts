import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class DeleteFollowerInput {
  @Field()
  @Column()
  userId: string;
}
