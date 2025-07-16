import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatorProfile {
  @Field()
  creatorId: string;

  @Field()
  fullName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}

@ObjectType()
export class FanProfile {
  @Field()
  fanId: string;

  @Field()
  fullName: string;

  @Field()
  username: string;

  @Field()
  avatarUrl: string;
}

@ObjectType()
export class GetChannelOutput {
  @Field()
  id: string;

  @Field()
  creatorId: string;

  @Field()
  fanId: string;

  @Field({ nullable: true })
  creatorLastSeenAt: Date;

  @Field()
  fanLastSeenAt: Date;

  @Field({ nullable: true })
  creatorLastSentAt: Date;

  @Field()
  fanLastSentAt: Date;

  @Field({ defaultValue: false })
  isPinned: boolean;

  @Field({ defaultValue: 'Follower' })
  label: string;

  @Field({ defaultValue: false })
  isMuted: boolean;

  @Field({ defaultValue: false })
  isRestricted: boolean;

  @Field({ defaultValue: false })
  isMessagingBlocked: boolean;

  @Field({ defaultValue: 0 })
  totalEarning: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorProfile, { nullable: true })
  creatorProfile: CreatorProfile;

  @Field(() => FanProfile, { nullable: true })
  fanProfile: FanProfile;
}
