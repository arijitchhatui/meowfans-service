import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessagesEntity } from './messages.entity';

@Entity({ name: 'message_reactions' })
export class MessageReactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  reaction: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => MessagesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
