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

  @JoinColumn({ name: 'creator_id' })
  @ManyToOne(() => CreatorProfilesEntity, ({ subscriptionPlans }) => subscriptionPlans, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;
}
