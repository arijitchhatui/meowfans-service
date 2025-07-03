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

@Entity({ name: 'creator_restricts' })
export class CreatorRestrictsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  restrictedUserId: string;

  @CreateDateColumn()
  restrictedAt: Date;

  @DeleteDateColumn()
  unRestrictedAt: Date;

  @ManyToOne(() => CreatorProfilesEntity, ({ creatorRestricts }) => creatorRestricts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @ManyToOne(() => UserProfilesEntity, ({ restrictedByCreators }) => restrictedByCreators)
  @JoinColumn({ name: 'restricted_user_id' })
  restrictedUserProfile: UserProfilesEntity;
}
