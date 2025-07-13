import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SharePostInput {
  @Field()
  postId: string;
}
