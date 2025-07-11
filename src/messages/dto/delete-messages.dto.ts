import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteMessagesInput {
  @Field(() => [ID])
  messageIds: string[];
}
