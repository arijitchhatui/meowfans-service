import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { MessageAssetsEntity } from './message-assets.entity';
import { MessageChannelsEntity } from './message-channels.entity';
import { MessagePurchasesEntity } from './message-purchases.entity';
import { MessageReactionsEntity } from './message-reactions.entity';
import { MessageRepliesEntity } from './message-replies.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'messages' })
export class MessagesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  content: string;

  @Column()
  creatorId: string;

  @Column()
  fanId: string;

  @Column()
  channelId: string;

  @Field()
  @Column({ default: 0 })
  price: number;

  @Field()
  @Column({ default: false })
  isExclusive: boolean;

  @ManyToOne(() => MessagesEntity, { nullable: true })
  @JoinColumn({ name: 'replied_to' })
  repliedTo?: MessagesEntity;

  @Field()
  @Column({ default: null, type: 'timestamp' })
  unlockedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field()
  @JoinColumn({ name: 'fan_id' })
  @ManyToOne(() => UserProfilesEntity, (userProfile) => userProfile.messages, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToMany(() => MessageRepliesEntity, (replies) => replies.message, { cascade: true })
  replies: MessageRepliesEntity[];

  @OneToOne(() => MessageReactionsEntity, { cascade: true })
  reaction: MessageReactionsEntity;

  @OneToMany(() => MessagePurchasesEntity, (messagePurchases) => messagePurchases.message, { cascade: true })
  messagePurchases: MessagePurchasesEntity[];

  @ManyToOne(() => MessageChannelsEntity, (channels) => channels.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  channel: MessageChannelsEntity;

  @OneToMany(() => MessageAssetsEntity, (messageAsset) => messageAsset.message, { cascade: true })
  messageAssets: MessageAssetsEntity[];
}
