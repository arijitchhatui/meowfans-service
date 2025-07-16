import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPostsInfoOutput {
  @Field()
  id: string;

  @Field()
  caption: string;

  @Field()
  isExclusive: boolean;

  @Field()
  unlockPrice: number;

  @Field({ defaultValue: 0 })
  likeCount: number;

  @Field({ defaultValue: 0 })
  saveCount: number;

  @Field({ defaultValue: 0 })
  shareCount: number;

  @Field({ defaultValue: 0 })
  commentCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field({ nullable: true })
  totalEarning: number;

  @Field({ nullable: true })
  latestComment: string;
}
