import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class UpdateUserProfileInput {
  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  avatarUrl: string;

  @Field()
  @Column()
  bannerUrl: string;
}
