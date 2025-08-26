import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorBlocksEntity } from './creator-blocks.entity';
import { CreatorFollowsEntity } from './creator-follows.entity';
import { CreatorRestrictsEntity } from './creator-restricts.entity';
import { FanAssetsEntity } from './fan-assets.entity';
import { FanPaymentProfilesEntity } from './fan-payment-profiles.entity';
import { GroupMessageRepliesEntity } from './group-message-replies.entity';
import { GroupMessagesEntity } from './group-messages.entity';
import { GroupsEntity } from './groups.entity';
import { MessageChannelsEntity } from './message-channels.entity';
import { MessagePurchasesEntity } from './message-purchases.entity';
import { MessageRepliesEntity } from './message-replies.entity';
import { PaymentsEntity } from './payments.entity';
import { PostCommentsEntity } from './post-comments.entity';
import { PostLikesEntity } from './post-likes.entity';
import { PostPurchasesEntity } from './post-purchases.entity';
import { PostSavesEntity } from './post-saves.entity';
import { PostSharesEntity } from './post-shares.entity';
import { PremiumPostUnlocksEntity } from './premium-post-unlocks.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { UsersEntity } from './users.entity';

@ObjectType()
@Entity({ name: 'fan_profiles' })
export class FanProfilesEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  fanId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ defaultValue: false })
  @Column({ type: 'bool', default: false })
  isBanned: false;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  appliedAt: Date;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  @Index()
  user: UsersEntity;

  @Field(() => [FanPaymentProfilesEntity])
  @OneToMany(() => FanPaymentProfilesEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  fanPaymentProfiles: FanPaymentProfilesEntity[];

  @Field(() => [CreatorFollowsEntity])
  @OneToMany(() => CreatorFollowsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  following: CreatorFollowsEntity[];

  @Field(() => [CreatorRestrictsEntity])
  @OneToMany(() => CreatorRestrictsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  restrictedByCreators: CreatorRestrictsEntity[];

  @Field(() => [CreatorBlocksEntity])
  @OneToMany(() => CreatorBlocksEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  blockedByCreators: CreatorBlocksEntity[];

  @Field(() => [MessageChannelsEntity])
  @OneToMany(() => MessageChannelsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  channels: MessageChannelsEntity[];

  @Field(() => [PaymentsEntity])
  @OneToMany(() => PaymentsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  payments: PaymentsEntity[];

  @Field(() => [GroupsEntity])
  @ManyToMany(() => GroupsEntity, ({ participants }) => participants, { cascade: true })
  participantGroups: GroupsEntity[];

  @Field(() => [GroupsEntity])
  @ManyToMany(() => GroupsEntity, ({ moderators }) => moderators, { cascade: true })
  moderatorGroups: GroupsEntity[];

  @Field(() => [FanAssetsEntity])
  @OneToMany(() => FanAssetsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  fanAssets: FanAssetsEntity[];

  @Field(() => [GroupMessagesEntity])
  @ManyToMany(() => GroupMessagesEntity, (fanProfile) => fanProfile.receivers, { cascade: true })
  groupReceivers: GroupMessagesEntity[];

  @Field(() => [SubscriptionsEntity])
  @OneToMany(() => SubscriptionsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  subscriptions: SubscriptionsEntity[];

  @Field(() => [PostPurchasesEntity])
  @OneToMany(() => PostPurchasesEntity, (purchases) => purchases.fanProfile, { cascade: true })
  postPurchases: PostPurchasesEntity[];

  @Field(() => [GroupMessageRepliesEntity])
  @ManyToMany(() => GroupMessageRepliesEntity, (groupMessageReplies) => groupMessageReplies.repliers, { cascade: true })
  groupMessageReplies: GroupMessageRepliesEntity[];

  @Field(() => [PostSharesEntity])
  @OneToMany(() => PostSharesEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  postShares: PostSharesEntity[];

  @Field(() => [PostSavesEntity])
  @OneToMany(() => PostSavesEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  postSaves: PostSavesEntity[];

  @Field(() => [MessageRepliesEntity])
  @OneToMany(() => PostLikesEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  postLikes: MessageRepliesEntity[];

  @Field(() => [PostCommentsEntity])
  @OneToMany(() => PostCommentsEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  postComments: PostCommentsEntity[];

  @Field(() => [MessagePurchasesEntity])
  @OneToMany(() => MessagePurchasesEntity, ({ fanProfile }) => fanProfile, { cascade: true })
  messagePurchases: MessagePurchasesEntity[];

  @Field(() => [PremiumPostUnlocksEntity])
  @OneToMany(() => PremiumPostUnlocksEntity, (postUnlocks) => postUnlocks.fanProfile)
  postUnlocks: PremiumPostUnlocksEntity[];
}
