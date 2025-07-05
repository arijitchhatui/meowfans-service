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
import { MessagesEntity } from './messages.entity';
import { PaymentsEntity } from './payments.entity';
import { PostCommentsEntity } from './post-comments.entity';
import { PostLikesEntity } from './post-likes.entity';
import { PostPurchasesEntity } from './post-purchases.entity';
import { PostSavesEntity } from './post-saves.entity';
import { PostSharesEntity } from './post-shares.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { UsersEntity } from './users.entity';

@ObjectType()
@Entity({ name: 'user_profiles' })
export class UserProfilesEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrl: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: UsersEntity;

  @Field(() => [FanPaymentProfilesEntity])
  @OneToMany(() => FanPaymentProfilesEntity, ({ userProfile }) => userProfile, { cascade: true })
  fanPaymentProfiles: FanPaymentProfilesEntity[];

  @Field(() => [CreatorFollowsEntity])
  @OneToMany(() => CreatorFollowsEntity, ({ userProfile }) => userProfile, { cascade: true })
  following: CreatorFollowsEntity[];

  @Field(() => [CreatorRestrictsEntity])
  @OneToMany(() => CreatorRestrictsEntity, ({ restrictedUserProfile }) => restrictedUserProfile, { cascade: true })
  restrictedByCreators: CreatorRestrictsEntity[];

  @Field(() => [CreatorBlocksEntity])
  @OneToMany(() => CreatorBlocksEntity, ({ blockedUserProfile }) => blockedUserProfile, { cascade: true })
  blockedByCreators: CreatorBlocksEntity[];

  @Field(() => [MessageChannelsEntity])
  @OneToMany(() => MessageChannelsEntity, ({ userProfile }) => userProfile, { cascade: true })
  channels: MessageChannelsEntity[];

  @Field(() => [PaymentsEntity])
  @OneToMany(() => PaymentsEntity, ({ userProfile }) => userProfile, { cascade: true })
  payments: PaymentsEntity[];

  @Field(() => [GroupsEntity])
  @ManyToMany(() => GroupsEntity, ({ participants }) => participants, { cascade: true })
  participantGroups: GroupsEntity[];

  @Field(() => [GroupsEntity])
  @ManyToMany(() => GroupsEntity, ({ moderators }) => moderators, { cascade: true })
  moderatorGroups: GroupsEntity[];

  @Field(() => [FanAssetsEntity])
  @OneToMany(() => FanAssetsEntity, ({ userProfile }) => userProfile, { cascade: true })
  fanAssets: FanAssetsEntity[];

  @Field(() => [GroupMessagesEntity])
  @ManyToMany(() => GroupMessagesEntity, (userProfile) => userProfile.receivers, { cascade: true })
  groupReceivers: GroupMessagesEntity[];

  @Field(() => [SubscriptionsEntity])
  @OneToMany(() => SubscriptionsEntity, ({ userProfile }) => userProfile, { cascade: true })
  subscriptions: SubscriptionsEntity[];

  @Field(() => [PostPurchasesEntity])
  @OneToMany(() => PostPurchasesEntity, (purchases) => purchases.userProfile, { cascade: true })
  postPurchases: PostPurchasesEntity[];

  @Field(() => [GroupMessageRepliesEntity])
  @ManyToMany(() => GroupMessageRepliesEntity, (groupMessageReplies) => groupMessageReplies.repliers, { cascade: true })
  groupMessageReplies: GroupMessageRepliesEntity[];

  @Field(() => [MessageRepliesEntity])
  @OneToMany(() => MessageRepliesEntity, (messageReplies) => messageReplies.userProfile, { cascade: true })
  messageReplies: MessageRepliesEntity[];

  @Field(() => [PostSharesEntity])
  @OneToMany(() => PostSharesEntity, ({ userProfile }) => userProfile, { cascade: true })
  postShares: PostSharesEntity[];

  @Field(() => [PostSavesEntity])
  @OneToMany(() => PostSavesEntity, ({ userProfile }) => userProfile, { cascade: true })
  postSaves: PostSavesEntity[];

  @Field(() => [MessageRepliesEntity])
  @OneToMany(() => PostLikesEntity, ({ userProfile }) => userProfile, { cascade: true })
  postLikes: MessageRepliesEntity[];

  @Field(() => [PostCommentsEntity])
  @OneToMany(() => PostCommentsEntity, ({ userProfile }) => userProfile, { cascade: true })
  postComments: PostCommentsEntity[];

  @Field(() => [MessagesEntity])
  @OneToMany(() => MessagesEntity, ({ userProfile }) => userProfile, { cascade: true })
  messages: MessagesEntity[];

  @Field(() => [MessagePurchasesEntity])
  @OneToMany(() => MessagePurchasesEntity, ({ userProfile }) => userProfile, { cascade: true })
  messagePurchases: MessagePurchasesEntity[];
}
