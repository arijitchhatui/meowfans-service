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

  @JoinColumn({ name: 'blocking_creator_id' })
  @ManyToOne(() => CreatorProfilesEntity, ({ creatorBlocks }) => creatorBlocks, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;

  @JoinColumn({ name: 'blocked_user_id' })
  @ManyToOne(() => UserProfilesEntity, ({ blockedByCreators }) => blockedByCreators, { onDelete: 'CASCADE' })
  blockedUserProfile: UserProfilesEntity;
}
