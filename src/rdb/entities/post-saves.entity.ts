import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntity } from './posts.entity';
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

  @ManyToOne(() => UserProfilesEntity, ({ postSaves }) => postSaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => PostsEntity, ({ postSaves }) => postSaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
