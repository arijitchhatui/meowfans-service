import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class RestrictFanInput {
  @Field()
  @Column()
  userId: string;
}
