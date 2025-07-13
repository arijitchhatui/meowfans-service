import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SendReplyToCreatorInput {
  @Field()
  message: string;

  @Field()
  @IsUUID()
  creatorId: string;

  @Field()
  @IsUUID()
  channelId: string;

  @Field()
  messageId: string;
}
