import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateChannelInput {
  @Field()
  channelId: string;

  @Field()
  isMuted: boolean;

  @Field()
  isRestricted: boolean;

  @Field()
  isBlocked: boolean;

  @Field()
  isMessagingBlocked: boolean;
}
