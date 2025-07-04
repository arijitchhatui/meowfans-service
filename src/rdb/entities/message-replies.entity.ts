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
import { MessagesEntity } from './messages.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'group_replies' })
export class MessageRepliesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  replierId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserProfilesEntity, (userProfile) => userProfile.messageReplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'replier_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => MessagesEntity, (messages) => messages.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
