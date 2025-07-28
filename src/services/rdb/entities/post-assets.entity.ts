import { Field, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
@Entity({ name: 'post_assets' })
export class PostAssetsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  creatorAssetId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => PostsEntity)
  @ManyToOne(() => PostsEntity, (post) => post.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;

  @Field(() => CreatorAssetsEntity)
  @ManyToOne(() => CreatorAssetsEntity, (creatorAsset) => creatorAsset.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_asset_id' })
  creatorAsset: CreatorAssetsEntity;
}
