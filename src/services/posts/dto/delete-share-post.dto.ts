import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteSharePostInput {
  @Field()
  shareId: string;

  @Field()
  postId: string;
}
