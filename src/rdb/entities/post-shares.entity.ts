import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'post_shares' })
export class PostSharesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserProfilesEntity, ({ postShares }) => postShares, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
