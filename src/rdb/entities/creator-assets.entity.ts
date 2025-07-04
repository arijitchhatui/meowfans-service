import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetsEntity } from './assets.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { MessageAssetsEntity } from './message-assets.entity';
import { PostAssetsEntity } from './post-assets.entity';

@Entity({ name: 'creator_assets' })
export class CreatorAssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  assetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.creatorAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @ManyToOne(() => AssetsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetsEntity;

  @OneToMany(() => MessageAssetsEntity, (messageAssets) => messageAssets.creatorAsset, { cascade: true })
  messageAssets: MessageAssetsEntity[];

  @OneToMany(() => PostAssetsEntity, (postAssets) => postAssets.creatorAsset, { cascade: true })
  postAssets: PostAssetsEntity[];
}
