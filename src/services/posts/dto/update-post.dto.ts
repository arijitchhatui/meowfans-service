import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field()
  postId: string;

  @Field({ nullable: true })
  caption: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  isExclusive: boolean;
}
