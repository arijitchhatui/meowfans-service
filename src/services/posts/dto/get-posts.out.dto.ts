import { Field, ObjectType } from '@nestjs/graphql';
import { AssetsEntity } from '../../rdb/entities';
import { PostsRawEntity } from '../../rdb/raw/posts.raw.entities';

@ObjectType()
export class GetPostsOutput extends PostsRawEntity {
  @Field(() => [AssetsEntity])
  assets: AssetsEntity[];
}
