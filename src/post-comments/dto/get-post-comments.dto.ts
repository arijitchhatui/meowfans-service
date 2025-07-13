import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetPostCommentsInput {
  @Field()
  offset: number;

  @Field()
  postId: string;
}
