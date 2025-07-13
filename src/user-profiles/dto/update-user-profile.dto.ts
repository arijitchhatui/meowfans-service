import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserProfileInput {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  bannerUrl: string;
}
