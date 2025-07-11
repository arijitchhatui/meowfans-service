import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendReactionInput {
  @Field()
  messageId: string;

  @Field()
  reaction: string;
}
