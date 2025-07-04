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

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @ManyToOne(() => UserProfilesEntity, ({ payments }) => payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;
}
