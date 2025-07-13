import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetBlockedUsersInput {
  @Field()
  offset: number;
}
