import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';

@Entity({ name: 'creator_payment_profiles' })
export class CreatorPaymentProfiles {
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

  @JoinColumn({ name: 'creator_id' })
  @OneToOne(() => CreatorProfilesEntity, ({ paymentProfile }) => paymentProfile, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;
}
