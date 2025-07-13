import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteMessageInput {
  @Field()
  messageId: string;
}
