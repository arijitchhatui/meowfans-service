import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FanProfileOutput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}
