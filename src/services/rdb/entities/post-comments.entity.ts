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
import { FanProfilesEntity } from './fan-profiles.entity';
import { PostsEntity } from './posts.entity';

@ObjectType()
@Entity({ name: 'post_comments' })
export class PostCommentsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  comment: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @Column()
  postId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ postComments }) => postComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;

  @Field(() => PostsEntity)
  @ManyToOne(() => PostsEntity, ({ postComments }) => postComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
