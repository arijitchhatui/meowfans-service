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

@Entity({ name: 'message_channels' })
export class MessageChannelsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  fanId: string;

  @Column()
  creatorLastSeenAt: Date;

  @Column()
  fanLastSeenAt: Date;

  @Column()
  creatorLastSentAt: Date;

  @Column()
  fanLastSentAt: Date;

  @Column()
  isPinned: boolean;

  @Column()
  label: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, ({ channels }) => channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @ManyToOne(() => UserProfilesEntity, ({ channels }) => channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @OneToMany(() => MessagesEntity, (message) => message.channel, { cascade: true })
  messages: MessagesEntity[];
}
