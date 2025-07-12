import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeletePostsInput {
  @Field(() => [ID])
  postIds: string[];
}
