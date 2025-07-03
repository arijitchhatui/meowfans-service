import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
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
  @ManyToOne(() => UserProfilesEntity, ({ messages }) => messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @JoinColumn({ name: 'creator_id' })
  @ManyToOne(() => CreatorProfilesEntity, ({ messages }) => messages, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;
}
