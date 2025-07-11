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
export class CreatorProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  creatorId: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  gender: string;

  @Column()
  region: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ default: false })
  allowsMessaging: boolean;

  @Column({ default: false })
  displayOnlineStatus: boolean;

  @Column({ default: false })
  allowsComment: boolean;

  @Column({ default: true })
  displayTotalPost: boolean;

  @Column({ default: false })
  displayTotalSubscriber: boolean;

  @Column({ default: 0 })
  totalPublicPost: number;

  @Column({ default: 0 })
  totalPost: number;

  @Column({ default: 0 })
  totalExclusivePost: number;

  @Column({ default: 0 })
  totalSubscriber: number;

  @Column({ default: 'primary' })
  themeColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  @Index()
  user: UsersEntity;

  @Field(() => [PostsEntity])
  @OneToMany(() => PostsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  posts: PostsEntity[];

  @Field(() => [CreatorFollowsEntity])
  @OneToMany(() => CreatorFollowsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  followers: CreatorFollowsEntity[];

  @Field(() => [CreatorRestrictsEntity])
  @OneToMany(() => CreatorRestrictsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorRestricts: CreatorRestrictsEntity[];

  @Field(() => [CreatorBlocksEntity])
  @OneToMany(() => CreatorBlocksEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorBlocks: CreatorBlocksEntity[];

  @Field(() => [CreatorInterfacesEntity])
  @OneToMany(() => CreatorInterfacesEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  interfaces: CreatorInterfacesEntity[];

  @Field(() => [AssetsEntity])
  @OneToMany(() => AssetsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  assets: AssetsEntity[];

  @Field(() => [MessageChannelsEntity])
  @OneToMany(() => MessageChannelsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  channels: MessageChannelsEntity[];

  @Field(() => [PaymentsEntity])
  @OneToMany(() => PaymentsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  payments: PaymentsEntity[];

  @Field(() => [CreatorPaymentProfilesEntity])
  @OneToOne(() => CreatorPaymentProfilesEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorPayMentProfile: CreatorPaymentProfilesEntity;

  @Field(() => [SubscriptionPlansEntity])
  @OneToMany(() => SubscriptionPlansEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  subscriptionPlans: SubscriptionPlansEntity[];

  @Field(() => [GroupsEntity])
  @OneToMany(() => GroupsEntity, ({ admin }) => admin, { cascade: true })
  groups: GroupsEntity[];

  @Field(() => [CreatorAssetsEntity])
  @OneToMany(() => CreatorAssetsEntity, ({ creatorProfile }) => creatorProfile, { cascade: true })
  creatorAssets: CreatorAssetsEntity[];

  @Field(() => [SocialAccountsEntity])
  @OneToOne(() => SocialAccountsEntity, { cascade: true })
  socialAccount: SocialAccountsEntity;

  @Field(() => [SubscriptionsEntity])
  @OneToMany(() => SubscriptionsEntity, (subscriptions) => subscriptions.creatorProfile, { cascade: true })
  subscriptions: SubscriptionsEntity[];

  @Field(() => [GroupsEntity])
  @OneToMany(() => GroupMessagesEntity, (groupMessages) => groupMessages.creatorProfile, { cascade: true })
  groupMessages: GroupMessagesEntity[];
}
