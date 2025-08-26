import { Field, ObjectType } from '@nestjs/graphql';
import { AssetsEntity } from '../../postgres/entities';
import { PostsRawEntity } from '../../postgres/raw/posts.raw.entities';

@ObjectType()
export class GetPostsOutput extends PostsRawEntity {
  @Field(() => [AssetsEntity])
  assets: AssetsEntity[];
}
