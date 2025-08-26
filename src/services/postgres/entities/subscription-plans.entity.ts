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
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { SubscriptionsEntity } from './subscriptions.entity';

@ObjectType()
@Entity({ name: 'subscription_plans' })
export class SubscriptionPlansEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  tier: string;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column()
  bannerUrl: string;

  @Field()
  @CreateDateColumn()
  subscribedAt: Date;

  @Field()
  @UpdateDateColumn()
  syncedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ subscriptionPlans }) => subscriptionPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => SubscriptionsEntity)
  @OneToOne(() => SubscriptionsEntity, { onDelete: 'CASCADE' })
  subscription: SubscriptionsEntity;
}
