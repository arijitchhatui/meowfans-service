import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMessageChannelParticipantInput {
  @Field()
  userId: string;

  @Field()
  messageChannelId: string;

  @Field({ nullable: true })
  lastSeenAt?: Date;

  @Field({ nullable: true })
  lastSentAt?: Date;
}
