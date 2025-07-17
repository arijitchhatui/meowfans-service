import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SendReplyToFanInput {
  @Field()
  message: string;

  @Field(() => Int)
  unlockPrice: number;

  @Field()
  @IsUUID()
  fanId: string;

  @Field()
  isExclusive: boolean;

  @Field()
  messageId: string;
}
