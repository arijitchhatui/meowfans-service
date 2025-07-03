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

@Entity({ name: 'payments' })
export class PaymentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  fanId: string;

  @Column()
  relatedEntityId: string;

  @Column()
  stripePaymentId: string;

  @Column()
  amountInCents: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @JoinColumn({ name: 'creator_id' })
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.payments, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;

  @JoinColumn({ name: 'fan_id' })
  @ManyToOne(() => UserProfilesEntity, ({ payments }) => payments, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
