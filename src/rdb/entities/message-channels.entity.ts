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

  @Field()
  @Column()
  creatorLastSeenAt: Date;

  @Field()
  @Column()
  fanLastSeenAt: Date;

  @Field()
  @Column()
  creatorLastSentAt: Date;

  @Field()
  @Column()
  fanLastSentAt: Date;

  @Field()
  @Column()
  isPinned: boolean;

  @Field()
  @Column()
  label: string;

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
