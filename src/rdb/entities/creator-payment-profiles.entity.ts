import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { SubscriptionsEntity } from './subscriptions.entity';

@Entity({ name: 'creator_payment_profiles' })
export class CreatorPaymentProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stripe_connect_id: string;

  @Column()
  creatorId: string;

  @Column()
  canTransfer: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.creatorPayMentProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToMany(() => SubscriptionsEntity, (subscriptions) => subscriptions.creatorPaymentProfile, { onDelete: 'CASCADE' })
  subscriptions: SubscriptionsEntity[];
}
