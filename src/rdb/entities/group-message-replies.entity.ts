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

@Entity({ name: 'group_message_replies' })
export class GroupMessageRepliesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @ManyToMany(() => UserProfilesEntity, (userProfiles) => userProfiles.groupMessageReplies, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_message_repliers',
    joinColumn: { name: 'group_reply_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  repliers: UserProfilesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => GroupMessagesEntity, (groupMessage) => groupMessage.groupMessageReplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  groupMessage: GroupMessagesEntity;
}
