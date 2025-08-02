import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchIdInput {
  @Field({ nullable: true })
  creatorId: string;

  @Field({ nullable: true })
  fanId: string;

  @Field({ nullable: true })
  postId: string;

  @Field({ nullable: true })
  messageId: string;

  @Field({ nullable: true })
  commentId: string;

  @Field({ nullable: true })
  assetId: string;
}
