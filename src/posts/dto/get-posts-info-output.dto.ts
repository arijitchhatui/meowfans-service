import { Field, ObjectType } from '@nestjs/graphql';
import { PostCommentsEntity } from 'src/rdb/entities';

@ObjectType()
export class GetPostsInfoOutput {
  @Field()
  id: string;

  @Field()
  caption: string;

  @Field()
  creatorId: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field({ defaultValue: 0 })
  earning: number;

  @Field(() => PostCommentsEntity)
  latestComment: PostCommentsEntity;
}
