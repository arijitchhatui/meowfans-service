import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostsEntity } from './posts.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'premium_post_unlocks' })
export class PremiumPostUnlocksEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  amount: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserProfilesEntity)
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => PostsEntity)
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
