import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetRestrictedUsersInput {
  @Field()
  offset: number;
}
