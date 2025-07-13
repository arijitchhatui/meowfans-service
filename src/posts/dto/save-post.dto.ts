import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SavePostInput {
  @Field()
  postId: string;
}
