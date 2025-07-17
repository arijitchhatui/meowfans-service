import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SendToFanMessageInput {
  @Field()
  message: string;

  @Field(() => Int)
  unlockPrice: number;

  @Field()
  @IsUUID()
  fanId: string;

  @Field()
  @IsUUID()
  channelId: string;

  @Field()
  isExclusive: boolean;
}
