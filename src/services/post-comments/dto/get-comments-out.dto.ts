import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FanProfileOutput {
  @Field()
  fullName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;

  @Field()
  fanId: string;
}

@ObjectType()
export class GetCommentsOutput {
  @Field()
  comment: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field()
  fanId: string;

  @Field()
  id: string;

  @Field()
  postId: string;

  @Field()
  updatedAt: Date;

  @Field(() => FanProfileOutput)
  fanProfile: FanProfileOutput;
}
