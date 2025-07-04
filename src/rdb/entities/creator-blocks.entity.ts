import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'creator_blocks' })
export class CreatorBlocksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blockedUserId: string;

  @Column()
  blockingCreatorId: string;

  @CreateDateColumn()
  blockedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, ({ creatorBlocks }) => creatorBlocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocking_creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @ManyToOne(() => UserProfilesEntity, ({ blockedByCreators }) => blockedByCreators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUserProfile: UserProfilesEntity;
}
