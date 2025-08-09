import { Field, ObjectType } from '@nestjs/graphql';
import { PostsRawEntity } from '../../rdb/raw';

@ObjectType()
export class GetPostsInfoOutput extends PostsRawEntity {
  @Field({ nullable: true })
  latestComment: string;
}
