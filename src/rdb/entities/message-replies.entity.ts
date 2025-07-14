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
import { FanProfilesEntity } from './fan-profiles.entity';
import { MessagesEntity } from './messages.entity';

@ObjectType()
@Entity({ name: 'group_replies' })
export class MessageRepliesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  messageId: string;

  @Field()
  @Column()
  replierId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, (fanProfile) => fanProfile.messageReplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'replier_id' })
  fanProfile: FanProfilesEntity;

  @Field(() => MessagesEntity)
  @ManyToOne(() => MessagesEntity, (messages) => messages.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
