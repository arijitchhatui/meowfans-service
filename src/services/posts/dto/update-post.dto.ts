import { PostTypes } from '@app/enums';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field()
  postId: string;

  @Field({ nullable: true })
  caption: string;

  @Field({ nullable: true })
  unlockPrice?: number;

  @Field(() => [PostTypes], { defaultValue: [PostTypes.EXCLUSIVE] })
  types: PostTypes[];
}
