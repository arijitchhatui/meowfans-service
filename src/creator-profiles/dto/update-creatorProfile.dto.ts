import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCreatorProfileInput {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  bannerUrl: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  allowsMessaging: boolean;

  @Field({ nullable: true })
  displayOnlineStatus: boolean;

  @Field({ nullable: true })
  allowsComment: boolean;

  @Field({ nullable: true })
  displayTotalPost: boolean;

  @Field({ nullable: true })
  displayTotalSubscriber: boolean;
}
