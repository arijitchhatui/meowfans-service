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
import { CreatorProfilesEntity } from './creator-profiles.entity';

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
}
