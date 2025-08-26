import { Field, ObjectType } from '@nestjs/graphql';
import { PostsRawEntity } from '../../postgres/raw';

@ObjectType()
export class GetPostsInfoOutput extends PostsRawEntity {
  @Field({ nullable: true })
  latestComment: string;
}
