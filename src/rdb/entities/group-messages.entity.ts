import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { GroupMessageRepliesEntity } from './group-message-replies.entity';
import { GroupsEntity } from './groups.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'group_messages' })
export class GroupMessagesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @Column()
  senderId: string;

  @ManyToMany(() => UserProfilesEntity, (userProfiles) => userProfiles.groupReceivers, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_receivers',
    joinColumn: { name: 'group_message_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  receivers: UserProfilesEntity[];

  @Column()
  message: string;

  @Column()
  isExclusive: boolean;

  @Column()
  isPinned: boolean;

  @Column()
  price: number;

  @Column()
  isCreator: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => GroupsEntity, (group) => group.groupMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: GroupsEntity;

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.groupMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToMany(() => GroupMessageRepliesEntity, (groupMessageReplies) => groupMessageReplies.groupMessage, {
    cascade: true,
  })
  groupMessageReplies: GroupMessageRepliesEntity[];
}
