import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  bannerUrl: string;

  @Field({ nullable: true })
  websiteUrl: string;
}
