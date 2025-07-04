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
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { SubscriptionsEntity } from './subscriptions.entity';

@Entity({ name: 'subscription_plans' })
export class SubscriptionPlansEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  description: string;

  @Column()
  tier: string;

  @Column()
  price: number;

  @Column()
  bannerUrl: string;

  @CreateDateColumn()
  subscribedAt: Date;

  @UpdateDateColumn()
  syncedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, ({ subscriptionPlans }) => subscriptionPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToOne(() => SubscriptionsEntity, { onDelete: 'CASCADE' })
  subscription: SubscriptionsEntity;
}
