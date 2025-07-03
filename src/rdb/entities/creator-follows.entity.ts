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

@Entity({ name: 'creator_follows' })
export class CreatorFollowsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followingUserId: string;

  @Column()
  followedCreatorId: string;

  @CreateDateColumn()
  followedAt: Date;

  @DeleteDateColumn({ nullable: true })
  unFollowedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, ({ followers }) => followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followed_creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @ManyToOne(() => UserProfilesEntity, ({ following }) => following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_user_id' })
  userProfile: UserProfilesEntity;
}
