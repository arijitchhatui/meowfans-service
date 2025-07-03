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

@Entity({ name: 'post_saves' })
export class PostSavesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserProfilesEntity, ({ postSaves }) => postSaves, { onDelete: 'CASCADE' })
  userProfile: UserProfilesEntity;
}
