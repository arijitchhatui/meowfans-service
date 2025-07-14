import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FanProfilesEntity } from './fan-profiles.entity';
import { PostsEntity } from './posts.entity';

@ObjectType()
@Entity({ name: 'post_likes' })
export class PostLikesEntity {
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

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ postLikes }) => postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;

  @Field(() => PostsEntity)
  @ManyToOne(() => PostsEntity, ({ postLikes }) => postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
