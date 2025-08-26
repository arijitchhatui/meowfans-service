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
import { JwtUser } from '../../auth';
import { UserRoles } from '../../service.constants';
import { MessageAssetsEntity } from './message-assets.entity';
import { MessageChannelsEntity } from './message-channels.entity';
import { MessagePurchasesEntity } from './message-purchases.entity';
import { MessageReactionsEntity } from './message-reactions.entity';
import { MessageRepliesEntity } from './message-replies.entity';

@ObjectType()
@Entity({ name: 'messages' })
export class MessagesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  senderId: string;

  @Field()
  @Column()
  recipientUserId: string;

  @Field()
  @Column()
  channelId: string;

  @Field(() => Number, { nullable: true })
  @Column({ type: 'float', nullable: true, default: null })
  unlockPrice: number | null;

  @Field()
  @Column({ default: false })
  isExclusive: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasAccess: boolean;

  public isFan(sender: JwtUser): boolean {
    return sender.roles.includes(UserRoles.FAN) ?? false;
  }

  public isCreator(sender: JwtUser): boolean {
    return sender.roles.includes(UserRoles.CREATOR) ?? false;
  }

  @Field(() => MessagesEntity, { nullable: true })
  @ManyToOne(() => MessagesEntity, { nullable: true })
  @JoinColumn({ name: 'replied_to' })
  repliedTo?: MessagesEntity | null;

  @Field({ nullable: true })
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

  @Field(() => MessageChannelsEntity)
  @ManyToOne(() => MessageChannelsEntity, (channel) => channel.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  channel: MessageChannelsEntity;

  @Field(() => [MessageRepliesEntity])
  @OneToMany(() => MessageRepliesEntity, (replies) => replies.message, { cascade: true })
  replies: MessageRepliesEntity[];

  @Field(() => MessageReactionsEntity)
  @OneToOne(() => MessageReactionsEntity, { cascade: true })
  reaction: MessageReactionsEntity;

  @Field(() => [MessagePurchasesEntity])
  @OneToMany(() => MessagePurchasesEntity, (messagePurchases) => messagePurchases.message, { cascade: true })
  messagePurchases: MessagePurchasesEntity[];

  @Field(() => [MessageAssetsEntity])
  @OneToMany(() => MessageAssetsEntity, (messageAsset) => messageAsset.message, { cascade: true })
  messageAssets: MessageAssetsEntity[];
}
