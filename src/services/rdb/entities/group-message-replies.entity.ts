import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FanProfilesEntity } from './fan-profiles.entity';
import { GroupMessagesEntity } from './group-messages.entity';

@ObjectType()
@Entity({ name: 'group_message_replies' })
export class GroupMessageRepliesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  messageId: string;

  @Field(() => [FanProfilesEntity])
  @ManyToMany(() => FanProfilesEntity, (userProfiles) => userProfiles.groupMessageReplies, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_message_repliers',
    joinColumn: { name: 'group_reply_id' },
    inverseJoinColumn: { name: 'fan_id' },
  })
  repliers: FanProfilesEntity[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => GroupMessagesEntity)
  @ManyToOne(() => GroupMessagesEntity, (groupMessage) => groupMessage.groupMessageReplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  groupMessage: GroupMessagesEntity;
}
