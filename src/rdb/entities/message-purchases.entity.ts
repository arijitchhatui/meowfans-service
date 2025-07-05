import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessagesEntity } from './messages.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'message_purchases' })
export class MessagePurchasesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  messageId: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @CreateDateColumn()
  purchasedAt: string;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ messagePurchases }) => messagePurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @Field(() => MessagesEntity)
  @ManyToOne(() => MessagesEntity, (message) => message.messagePurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
