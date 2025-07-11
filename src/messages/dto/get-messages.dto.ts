import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class GetMessagesInput {
  @Field()
  @Column()
  channelId: string;

  @Field()
  @Column()
  offset: number;
}
