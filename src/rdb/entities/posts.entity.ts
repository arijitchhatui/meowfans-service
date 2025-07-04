import { Field, ObjectType } from '@nestjs/graphql';
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
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { PostAssetsEntity } from './post-assets.entity';
import { PostCommentsEntity } from './post-comments.entity';
import { PostLikesEntity } from './post-likes.entity';
import { PostPurchasesEntity } from './post-purchases.entity';
import { PostSavesEntity } from './post-saves.entity';
import { PostSharesEntity } from './post-shares.entity';

@ObjectType()
@Entity({ name: 'posts' })
export class PostsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  caption: string;

  @Column()
  creatorId: string;

  @Field()
  @Column()
  isExclusive: boolean;

  @Field()
  @Column()
  price: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  likeCount: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  saveCount: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  shareCount: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field()
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @OneToMany(() => PostLikesEntity, ({ post }) => post, { cascade: true })
  postLikes: PostLikesEntity[];

  @OneToMany(() => PostAssetsEntity, ({ post }) => post, { cascade: true })
  postAssets: PostAssetsEntity[];

  @OneToMany(() => PostCommentsEntity, ({ post }) => post, { cascade: true })
  postComments: PostCommentsEntity[];

  @OneToMany(() => PostPurchasesEntity, ({ post }) => post, { cascade: true })
  postPurchases: PostPurchasesEntity[];

  @OneToMany(() => PostSavesEntity, ({ post }) => post, { cascade: true })
  postSaves: PostSavesEntity[];

  @OneToMany(() => PostSharesEntity, ({ post }) => post, { cascade: true })
  postShares: PostSharesEntity[];
}
