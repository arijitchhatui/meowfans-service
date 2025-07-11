import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class UpdateChannelInput {
  @Field()
  @Column()
  channelId: string;

  @Field()
  @Column()
  isMuted: boolean;

  @Field()
  @Column()
  isRestricted: boolean;

  @Field()
  @Column()
  isBlocked: boolean;

  @Field()
  @Column()
  isMessagingBlocked: boolean;
}
