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
import { CreatorAssetsEntity } from './creator-assets.entity';
import { PostsEntity } from './posts.entity';

@Entity({ name: 'post_assets' })
export class PostAssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  assetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => PostsEntity, (post) => post.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;

  @ManyToOne(() => CreatorAssetsEntity, (creatorAsset) => creatorAsset.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  creatorAsset: CreatorAssetsEntity;
}
