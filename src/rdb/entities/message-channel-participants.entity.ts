import { Injectable } from '@nestjs/common';
import { ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../../util';
import { MessageChannelsEntity } from './message-channels.entity';

@ObjectType()
@Injectable()
@Entity({ name: 'message_channel_participants' })
export class MessageChannelParticipantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  messageChannelId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  role: UserRoles;

  @Column({ type: 'timestamp', default: null })
  lastSeenAt: Date;

  @Column({ type: 'timestamp', default: null })
  lastSentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MessageChannelsEntity, ({ participants }) => participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_channel_id' })
  messageChannel: MessageChannelsEntity;
}
