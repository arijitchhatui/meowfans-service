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
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'group_messages' })
export class GroupMessagesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @Column()
  senderId: string;

  @Column()
  receiversId: string[];

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

  @Column()
  repliedTo: GroupMessagesEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserProfilesEntity, ({ groupMessages }) => groupMessages, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
