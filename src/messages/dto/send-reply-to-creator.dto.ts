import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { MessagesEntity } from 'src/rdb/entities';

@InputType()
export class SendReplyToCreatorInput {
  @Field(() => MessagesEntity)
  repliedTo: MessagesEntity;

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
