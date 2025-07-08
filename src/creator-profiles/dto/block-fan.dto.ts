import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class BlockFanInput {
  @Field()
  @Column()
  userId: string;
}
