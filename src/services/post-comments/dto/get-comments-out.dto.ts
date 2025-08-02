import { Field, ObjectType } from '@nestjs/graphql';
import { FanProfileOutput } from '../../../lib/helpers';

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
