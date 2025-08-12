import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PostsRawEntity } from '../raw/posts.raw.entities';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { PostAssetsEntity } from './post-assets.entity';
import { PostCommentsEntity } from './post-comments.entity';
import { PostLikesEntity } from './post-likes.entity';
import { PostPurchasesEntity } from './post-purchases.entity';
import { PostSavesEntity } from './post-saves.entity';
import { PostSharesEntity } from './post-shares.entity';
import { PremiumPostUnlocksEntity } from './premium-post-unlocks.entity';

@ObjectType()
@Entity({ name: 'posts' })
export class PostsEntity extends PostsRawEntity {
  @Field(() => PostCommentsEntity, { nullable: true })
  @OneToOne(() => PostCommentsEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_comment_id' })
  latestComment: PostCommentsEntity | null;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => [PostLikesEntity])
  @OneToMany(() => PostLikesEntity, (postLikes) => postLikes.post, { cascade: true })
  postLikes: PostLikesEntity[];

  @Field(() => [PostAssetsEntity])
  @OneToMany(() => PostAssetsEntity, ({ post }) => post, { cascade: true })
  postAssets: PostAssetsEntity[];

  @Field(() => [PostCommentsEntity])
  @OneToMany(() => PostCommentsEntity, ({ post }) => post, { cascade: true })
  postComments: PostCommentsEntity[];

  @Field(() => [PostPurchasesEntity])
  @OneToMany(() => PostPurchasesEntity, ({ post }) => post, { cascade: true })
  postPurchases: PostPurchasesEntity[];

  @Field(() => [PostSavesEntity])
  @OneToMany(() => PostSavesEntity, ({ post }) => post, { cascade: true })
  postSaves: PostSavesEntity[];

  @Field(() => [PostSharesEntity])
  @OneToMany(() => PostSharesEntity, ({ post }) => post, { cascade: true })
  postShares: PostSharesEntity[];

  @Field(() => [PremiumPostUnlocksEntity])
  @OneToMany(() => PremiumPostUnlocksEntity, (postUnlocks) => postUnlocks.post)
  postUnlocks: PremiumPostUnlocksEntity[];
}
