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
import { FanProfilesEntity } from './fan-profiles.entity';
import { PostsEntity } from './posts.entity';

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

  @ManyToOne(() => FanProfilesEntity)
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;

  @ManyToOne(() => PostsEntity)
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
