import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field()
  postId: string;

  @Field()
  caption: string;

  @Field()
  price: number;

  @Field()
  isExclusive: boolean;
}
