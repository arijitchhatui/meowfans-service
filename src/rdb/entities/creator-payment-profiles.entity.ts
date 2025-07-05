import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'creator_payment_profiles' })
export class CreatorPaymentProfilesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  stripe_connect_id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  canTransfer: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => CreatorProfilesEntity)
  @OneToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.creatorPayMentProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => [SubscriptionsEntity])
  @OneToMany(() => SubscriptionsEntity, (subscriptions) => subscriptions.creatorPaymentProfile, { onDelete: 'CASCADE' })
  subscriptions: SubscriptionsEntity[];
}
