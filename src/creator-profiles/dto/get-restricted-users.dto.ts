import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetRestrictedUsersInput {
  @Field(() => Int)
  offset: number;
}
