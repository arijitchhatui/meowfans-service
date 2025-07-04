import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessagesEntity } from './messages.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'message_purchases' })
export class MessagePurchasesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  fanId: string;

  @CreateDateColumn()
  purchasedAt: string;

  @ManyToOne(() => UserProfilesEntity, ({ messagePurchases }) => messagePurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => MessagesEntity, (message) => message.messagePurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
