import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetsEntity } from './assets.entity';
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

  @ManyToOne(() => UserProfilesEntity, (userProfile) => userProfile.fanAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => AssetsEntity, (assets) => assets.fanAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetsEntity;
}
