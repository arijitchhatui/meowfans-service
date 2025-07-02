import { Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

@Entity({ name: 'creator-profiles' })
export class CreatorProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  creatorId: string;

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

  @Column()
  gender: string;

  @Column()
  region: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ default: false })
  allowsMessaging: boolean;

  @Column({ default: false })
  displayOnlineStatus: boolean;

  @Column({ default: false })
  allowsComment: boolean;

  @Column({ default: true })
  displayTotalPost: boolean;

  @Column({ default: false })
  displayTotalSubscriber: boolean;

  @Column({ default: 0 })
  totalPublicPost: number;

  @Column({ default: 0 })
  totalExclusivePost: number;

  @Column({ default: 0 })
  totalSubscriber: number;

  @Column()
  themeColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
