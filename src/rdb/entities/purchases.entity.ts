import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'purchases' })
export class PurchasesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  relatedEntityId: string;

  @Column()
  fanId: string;

  @CreateDateColumn()
  purchasedAt: Date;

  @JoinColumn({ name: 'fan_id' })
  @ManyToOne(() => UserProfilesEntity, ({ purchases }) => purchases, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
