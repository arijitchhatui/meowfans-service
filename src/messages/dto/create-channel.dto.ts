import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateChannelInput {
  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  channelId: string;
}
