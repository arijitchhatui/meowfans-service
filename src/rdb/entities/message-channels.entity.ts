import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { MessagesEntity } from './messages.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'message_channels' })
export class MessageChannelsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  fanId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  creatorLastSeenAt: Date;

  @Field()
  @Column()
  fanLastSeenAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  creatorLastSentAt: Date;

  @Field()
  @Column()
  fanLastSentAt: Date;

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

  @Field()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ channels }) => channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ channels }) => channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @Field(() => [MessagesEntity])
  @OneToMany(() => MessagesEntity, (message) => message.channel, { cascade: true })
  messages: MessagesEntity[];
}
