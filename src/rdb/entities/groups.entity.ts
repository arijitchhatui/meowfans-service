import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'groups' })
export class GroupsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminId: string;

  @JoinColumn({ name: 'admin_id' })
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.groups)
  admin: CreatorProfilesEntity;

  @Column()
  description: string;

  @Column()
  groupName: string;

  @Column()
  iconUrl: string;

  @Column()
  bannerUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column()
  isPinned: boolean;

  @Column()
  isMuted: boolean;

  @Column()
  isRestricted: boolean;

  @Column()
  isBlocked: boolean;

  @Column()
  backgroundColor: string;

  @ManyToMany(() => UserProfilesEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_participants',
    joinColumn: { name: 'group_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  participants: UserProfilesEntity[];

  @ManyToMany(() => UserProfilesEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_moderators',
    joinColumn: { name: 'group_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  moderators: UserProfilesEntity[];
}
