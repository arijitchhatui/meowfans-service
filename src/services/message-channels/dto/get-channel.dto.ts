import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetChannelInput {
  @Field()
  channelId: string;
}
