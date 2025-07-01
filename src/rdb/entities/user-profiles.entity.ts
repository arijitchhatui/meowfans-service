import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostsEntity } from './posts.entity';
import { UsersEntity } from './users.entity';

@ObjectType()
@Entity({ name: 'user_profiles' })
export class UserProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Index()
  user: UsersEntity;

  @Field()
  @OneToMany(() => PostsEntity, (post) => post.userProfile, { cascade: true })
  posts: PostsEntity[];

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  websiteUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
