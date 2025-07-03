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
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'subscriptions' })
export class SubscriptionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  subscriberId: string;

  @Column()
  creatorPaymentProfileId: string;

  @Column()
  subscriptionPlanId: string;

  @Column()
  stripeSubscriptionId: string;

  @Column()
  months: number;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  syncedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @JoinColumn({ name: 'creator_payment_profile_id' })
  @ManyToOne(() => CreatorProfilesEntity, ({ subscriptions }) => subscriptions, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;

  @JoinColumn({ name: 'subscriber_id' })
  @ManyToOne(() => UserProfilesEntity, ({ subscriptions }) => subscriptions, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
