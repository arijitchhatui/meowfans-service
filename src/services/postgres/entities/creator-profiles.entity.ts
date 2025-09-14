import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssetsEntity } from './assets.entity';
import { CreatorAssetsEntity } from './creator-assets.entity';
import { CreatorBlocksEntity } from './creator-blocks.entity';
import { CreatorFollowsEntity } from './creator-follows.entity';
import { CreatorInterfacesEntity } from './creator-interfaces.entity';
import { CreatorPaymentProfilesEntity } from './creator-payment-profiles.entity';
import { CreatorRestrictsEntity } from './creator-restricts.entity';
import { GroupMessagesEntity } from './group-messages.entity';
import { GroupsEntity } from './groups.entity';
import { MessageChannelsEntity } from './message-channels.entity';
import { PaymentsEntity } from './payments.entity';
import { PostsEntity } from './posts.entity';
import { SocialAccountsEntity } from './social-accounts.entity';
import { SubscriptionPlansEntity } from './subscription-plans.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { UsersEntity } from './users.entity';

@ObjectType()
@Entity({ name: 'creator_profiles' })
@Index('IDX_CREATOR_PROFILES_ACCEPTED_AT', ['acceptedAt'])
@Index('IDX_CREATOR_PROFILES_REJECTED_AT', ['rejectedAt'])
@Index('IDX_CREATOR_PROFILES_VERIFIED', ['verified'])
export class CreatorProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  creatorId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  allowsMessaging: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  displayOnlineStatus: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  allowsComment: boolean;

  @Field({ defaultValue: true })
  @Column({ default: true })
  displayTotalPost: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  displayTotalSubscriber: boolean;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  totalPublicPost: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  totalPost: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  totalExclusivePost: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  totalSubscriber: number;

  @Field({ defaultValue: 'primary' })
  @Column({ default: 'primary' })
  themeColor: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  verified: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  @Index()
  user: UsersEntity;

  @OneToMany(() => PostsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  posts: PostsEntity[];

  @OneToMany(() => CreatorFollowsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  followers: CreatorFollowsEntity[];

  @OneToMany(() => CreatorRestrictsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorRestricts: CreatorRestrictsEntity[];

  @OneToMany(() => CreatorBlocksEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorBlocks: CreatorBlocksEntity[];

  @Field(() => [CreatorInterfacesEntity])
  @OneToMany(() => CreatorInterfacesEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  interfaces: CreatorInterfacesEntity[];

  @OneToMany(() => AssetsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  assets: AssetsEntity[];

  @OneToMany(() => MessageChannelsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  channels: MessageChannelsEntity[];

  @OneToMany(() => PaymentsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  payments: PaymentsEntity[];

  @OneToOne(() => CreatorPaymentProfilesEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorPayMentProfile: CreatorPaymentProfilesEntity;

  @OneToMany(() => SubscriptionPlansEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  subscriptionPlans: SubscriptionPlansEntity[];

  @OneToMany(() => GroupsEntity, ({ admin }) => admin, { cascade: true })
  groups: GroupsEntity[];

  @OneToMany(() => CreatorAssetsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorAssets: CreatorAssetsEntity[];

  @Field(() => [SocialAccountsEntity])
  @OneToOne(() => SocialAccountsEntity, { cascade: true })
  socialAccount: SocialAccountsEntity;

  @OneToMany(() => SubscriptionsEntity, (subscriptions) => subscriptions.creatorProfile, { cascade: true })
  subscriptions: SubscriptionsEntity[];

  @OneToMany(() => GroupMessagesEntity, (groupMessages) => groupMessages.creatorProfile, { cascade: true })
  groupMessages: GroupMessagesEntity[];
}
