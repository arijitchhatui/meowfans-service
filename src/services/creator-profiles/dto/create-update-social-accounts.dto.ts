import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAndUpdateSocialAccountsInput {
  @Field({ nullable: true })
  faceBook: string;

  @Field({ nullable: true })
  twitter: string;

  @Field({ nullable: true })
  instagram: string;

  @Field({ nullable: true })
  website: string;
}
