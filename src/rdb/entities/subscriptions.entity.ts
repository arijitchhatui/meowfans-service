import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorPaymentProfilesEntity } from './creator-payment-profiles.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { SubscriptionPlansEntity } from './subscription-plans.entity';
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

  @ManyToOne(() => CreatorPaymentProfilesEntity, (creatorPaymentProfile) => creatorPaymentProfile.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_payment_profile_id' })
  creatorPaymentProfile: CreatorPaymentProfilesEntity;

  @ManyToOne(() => UserProfilesEntity, ({ subscriptions }) => subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriber_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToOne(() => SubscriptionPlansEntity, { cascade: true })
  @JoinColumn({ name: 'subscription_plan_id' })
  subscriptionPlan: SubscriptionPlansEntity;
}
