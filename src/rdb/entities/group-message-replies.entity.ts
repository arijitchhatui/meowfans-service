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
import { GroupMessagesEntity } from './group-messages.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'group_message_replies' })
export class GroupMessageRepliesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  messageId: string;

  @Field(() => [UserProfilesEntity])
  @ManyToMany(() => UserProfilesEntity, (userProfiles) => userProfiles.groupMessageReplies, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_message_repliers',
    joinColumn: { name: 'group_reply_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  repliers: UserProfilesEntity[];

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
