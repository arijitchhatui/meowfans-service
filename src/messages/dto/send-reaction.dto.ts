import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SendReactionInput {
  @IsUUID()
  @Field()
  messageId: string;

  @Field()
  reaction: string;
}
