import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class SendMessageFromFanInput {
  @Field()
  content: string;

  @Field()
  @IsUUID()
  senderId: string;

  @IsUUID()
  @Field()
  recipientUserId: string;

  @IsOptional()
  @Field({ nullable: true })
  messageId: string;
}
