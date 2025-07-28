import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChannelInput {
  @Field()
  creatorId: string;

  @Field()
  fanId: string;
}
