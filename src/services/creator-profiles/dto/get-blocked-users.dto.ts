import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetBlockedUsersInput {
  @Field(() => Int)
  offset: number;
}
