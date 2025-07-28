import { Field, InputType } from '@nestjs/graphql';
import { Validate, ValidateIf } from 'class-validator';
import { ProfanityValidator, UniqueUsernameValidator } from '../../../lib';

@InputType()
export class UpdateCreatorProfileInput {
  @Field({ nullable: true })
  @ValidateIf(({ username }) => username !== undefined)
  @Validate(ProfanityValidator)
  @Validate(UniqueUsernameValidator)
  username: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  bannerUrl: string;

  @Field({ nullable: true })
  @ValidateIf(({ bio }) => bio !== undefined)
  @Validate(ProfanityValidator)
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
