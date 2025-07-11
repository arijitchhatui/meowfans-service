import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SendToCreatorMessageInput {
  @Field()
  message: string;

  @Field()
  @IsUUID()
  creatorId: string;

  @Field()
  @IsUUID()
  channelId: string;
}
