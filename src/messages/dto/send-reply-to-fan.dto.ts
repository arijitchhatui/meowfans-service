import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { MessagesEntity } from 'src/rdb/entities';

@InputType()
export class SendReplyToFanInput {
  @Field()
  message: string;

  @Field()
  unlockPrice: number;

  @Field()
  @IsUUID()
  fanId: string;

  @Field()
  @IsUUID()
  channelId: string;

  @Field()
  isExclusive: boolean;

  @Field(() => MessagesEntity)
  repliedTo: MessagesEntity;

  @Field()
  messageId: string;
}
