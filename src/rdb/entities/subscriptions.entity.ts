import { Field, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
@Entity({ name: 'subscriptions' })
export class SubscriptionsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  subscriberId: string;

  @Field()
  @Column()
  creatorPaymentProfileId: string;

  @Field()
  @Column()
  subscriptionPlanId: string;

  @Field()
  @Column()
  stripeSubscriptionId: string;

  @Field()
  @Column()
  months: number;

  @Field()
  @Column()
  price: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  syncedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorPaymentProfilesEntity)
  @ManyToOne(() => CreatorPaymentProfilesEntity, (creatorPaymentProfile) => creatorPaymentProfile.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_payment_profile_id' })
  creatorPaymentProfile: CreatorPaymentProfilesEntity;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ subscriptions }) => subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriber_id' })
  userProfile: UserProfilesEntity;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => SubscriptionPlansEntity)
  @OneToOne(() => SubscriptionPlansEntity, { cascade: true })
  @JoinColumn({ name: 'subscription_plan_id' })
  subscriptionPlan: SubscriptionPlansEntity;
}
