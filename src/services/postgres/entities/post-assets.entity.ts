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
import { PostsEntity } from './posts.entity';
import { AssetsEntity } from './assets.entity';

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
  assetId: string;

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

  @Field(() => AssetsEntity)
  @ManyToOne(() => AssetsEntity, (asset) => asset.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetsEntity;
}
