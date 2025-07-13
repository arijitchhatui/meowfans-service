import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetFollowersInput {
  @Field()
  offset: number;
}
