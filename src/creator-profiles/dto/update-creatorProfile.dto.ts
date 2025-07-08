import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class UpdateCreatorProfileInput {
  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  avatarUrl: string;

  @Field()
  @Column()
  bannerUrl: string;

  @Field()
  @Column()
  bio: string;

  @Field()
  @Column()
  allowsMessaging: boolean;

  @Field()
  @Column()
  displayOnlineStatus: boolean;

  @Field()
  @Column()
  allowsComment: boolean;

  @Field()
  @Column()
  displayTotalPost: boolean;

  @Field()
  @Column()
  displayTotalSubscriber: boolean;
}
