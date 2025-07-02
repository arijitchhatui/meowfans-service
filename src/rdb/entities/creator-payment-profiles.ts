import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
