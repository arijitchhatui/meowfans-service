import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'fan_payment_profiles' })
export class FanPaymentProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fanId: string;

  @Column()
  stripeCustomerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserProfilesEntity, ({ fanPaymentProfiles }) => fanPaymentProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;
}
