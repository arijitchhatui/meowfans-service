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
import { FanPaymentProfilesEntity } from './fan-payment-profiles';
import { GroupMessagesEntity } from './group-messages.entity';
import { GroupRepliesEntity } from './group-replies.entity';
import { GroupsEntity } from './groups.entity';
import { MessageChannelsEntity } from './message-channels.entity';
import { MessageRepliesEntity } from './message-replies.entity';
import { MessagesEntity } from './messages.entity';
import { PaymentsEntity } from './payments.entity';
import { PostCommentsEntity } from './post-comments.entity';
import { PostLikesEntity } from './post-likes.entity';
import { PostSavesEntity } from './post-saves.entity';
import { PostSharesEntity } from './post-shares.entity';
import { PurchasesEntity } from './purchases.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { UsersEntity } from './users.entity';

@ObjectType()
@Entity({ name: 'user_profiles' })
export class UserProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: UsersEntity;

  @OneToMany(() => FanPaymentProfilesEntity, ({ userProfile }) => userProfile, { cascade: true })
  fanPaymentProfiles: FanPaymentProfilesEntity[];

  @OneToMany(() => CreatorFollowsEntity, ({ userProfile }) => userProfile, { cascade: true })
  following: CreatorFollowsEntity[];

  @OneToMany(() => CreatorRestrictsEntity, ({ restrictedUserProfile }) => restrictedUserProfile, { cascade: true })
  restrictedByCreators: CreatorRestrictsEntity[];

  @OneToMany(() => CreatorBlocksEntity, ({ blockedUserProfile }) => blockedUserProfile, { cascade: true })
  blockedByCreators: CreatorBlocksEntity[];

  @OneToMany(() => MessageChannelsEntity, ({ userProfile }) => userProfile, { cascade: true })
  channels: MessageChannelsEntity[];

  @OneToMany(() => PaymentsEntity, ({ userProfile }) => userProfile, { cascade: true })
  payments: PaymentsEntity[];

  @ManyToMany(() => GroupsEntity, ({ participants }) => participants, { cascade: true })
  participantGroups: GroupsEntity[];

  @ManyToMany(() => GroupsEntity, ({ moderators }) => moderators, { cascade: true })
  moderatorGroups: GroupsEntity[];

  @OneToMany(() => FanAssetsEntity, ({ userProfile }) => userProfile, { cascade: true })
  fanAssets: FanAssetsEntity[];

  @OneToMany(() => GroupMessagesEntity, ({ userProfile }) => userProfile, { cascade: true })
  groupMessages: GroupMessagesEntity[];

  @OneToMany(() => SubscriptionsEntity, ({ userProfile }) => userProfile, { cascade: true })
  subscriptions: SubscriptionsEntity[];

  @OneToMany(() => PurchasesEntity, ({ userProfile }) => userProfile, { cascade: true })
  purchases: PurchasesEntity[];

  @OneToMany(() => GroupRepliesEntity, ({ userProfile }) => userProfile, { cascade: true })
  groupReplies: GroupRepliesEntity[];

  @OneToMany(() => MessageRepliesEntity, ({ userProfile }) => userProfile, { cascade: true })
  messageReplies: MessageRepliesEntity[];

  @OneToMany(() => PostSharesEntity, ({ userProfile }) => userProfile, { cascade: true })
  postShares: PostSharesEntity[];

  @OneToMany(() => PostSavesEntity, ({ userProfile }) => userProfile, { cascade: true })
  postSaves: PostSavesEntity[];

  @OneToMany(() => PostLikesEntity, ({ userProfile }) => userProfile, { cascade: true })
  postLikes: MessageRepliesEntity[];

  @OneToMany(() => PostCommentsEntity, ({ userProfile }) => userProfile, { cascade: true })
  postComments: PostCommentsEntity[];

  @OneToMany(() => MessagesEntity, ({ userProfile }) => userProfile, { cascade: true })
  messages: MessagesEntity[];
}
