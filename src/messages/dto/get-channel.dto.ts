import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class GetChannelInput {
  @Field()
  @Column()
  channelId: string;
}
