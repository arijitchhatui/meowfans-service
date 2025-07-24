import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateChannelInput {
  @Field()
  channelId: string;

  @Field({ nullable: true })
  isMuted: boolean;

  @Field({ nullable: true })
  isRestricted: boolean;

  @Field({ nullable: true })
  isBlocked: boolean;

  @Field({ nullable: true })
  isMessagingBlocked: boolean;
}
