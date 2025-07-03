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

@Entity({ name: 'fan_assets' })
export class FanAssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fanId: string;

  @Column()
  assetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @JoinColumn({ name: 'fan_id' })
  @ManyToOne(() => UserProfilesEntity, ({ fanAssets }) => fanAssets, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
