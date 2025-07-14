import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FanProfilesEntity } from './fan-profiles.entity';
import { PostsEntity } from './posts.entity';

@ObjectType()
@Entity({ name: 'post_shares' })
export class PostSharesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  postId: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ postShares }) => postShares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;

  @Field(() => PostsEntity)
  @ManyToOne(() => PostsEntity, ({ postShares }) => postShares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
