import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateMessageInput {
  @Field()
  @IsUUID()
  messageId: string;

  @Field()
  message: string;
}
