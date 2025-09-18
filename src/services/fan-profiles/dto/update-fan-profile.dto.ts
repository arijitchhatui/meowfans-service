import { ProfanityValidator } from '@app/validators';
import { Field, InputType } from '@nestjs/graphql';
import { Validate, ValidateIf } from 'class-validator';
import { UniqueUsernameValidator } from '../../auth';

@InputType()
export class UpdateUserProfileInput {
  @Field({ nullable: true })
  @ValidateIf(({ username }) => username !== undefined)
  @Validate(UniqueUsernameValidator)
  @Validate(ProfanityValidator)
  username: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  bannerUrl: string;
}
