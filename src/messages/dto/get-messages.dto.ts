import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetMessagesInput {
  @Field()
  channelId: string;

  @Field()
  offset: number;
}
