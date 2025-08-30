import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanProfilesEntity } from './fan-profiles.entity';
import { MessageChannelParticipantsEntity } from './message-channel-participants.entity';
import { MessagesEntity } from './messages.entity';

@ObjectType()
@Entity({ name: 'message_channels' })
@Index('IDX_MESSAGE_CHANNELS_CREATED_AT', ['createdAt'])
@Index('IDX_MESSAGE_CHANNELS_LAST_MESSAGE_ID', ['lastMessageId'])
export class MessageChannelsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  lastMessageId: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isPinned: boolean;

  @Field({ defaultValue: 'Follower' })
  @Column({ default: 'Follower' })
  label: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isMuted: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isRestricted: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isMessagingBlocked: boolean;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  totalEarning: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => MessagesEntity)
  @OneToOne(() => MessagesEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: MessagesEntity | null;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ channels }) => channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ channels }) => channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;

  @Field(() => [MessagesEntity])
  @OneToMany(() => MessagesEntity, (message) => message.channel, { cascade: true, eager: false })
  messages: MessagesEntity[];

  @OneToMany(() => MessageChannelParticipantsEntity, ({ messageChannel }) => messageChannel)
  participants: MessageChannelParticipantsEntity[];
}
