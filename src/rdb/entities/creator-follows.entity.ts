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
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'creator_follows' })
export class CreatorFollowsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  followingUserId: string;

  @Field()
  @Column()
  followedCreatorId: string;

  @Field()
  @CreateDateColumn()
  followedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  unFollowedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ followers }) => followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followed_creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ following }) => following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_user_id' })
  userProfile: UserProfilesEntity;
}
