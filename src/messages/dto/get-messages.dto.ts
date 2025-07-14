import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetMessagesInput {
  @Field()
  channelId: string;

  @Field(() => Int)
  offset: number;
}
