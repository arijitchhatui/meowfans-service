import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorAssetsEntity } from './creator-assets.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanAssetsEntity } from './fan-assets.entity';

@Entity({ name: 'assets' })
export class AssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rawUrl: string;

  @Column()
  blurredUrl: string;

  @Column()
  creatorId: string;

  @Column()
  type: string;

  @Column()
  mimeType: string;

  @Column()
  contentType: string;

  @Column({ default: false })
  isVideo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToMany(() => FanAssetsEntity, (fanAssets) => fanAssets.asset, { cascade: true })
  fanAssets: FanAssetsEntity[];

  @OneToMany(() => CreatorAssetsEntity, (creatorAssets) => creatorAssets.asset, { cascade: true })
  creatorAssets: CreatorAssetsEntity[];
}
