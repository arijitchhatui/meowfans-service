import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfilesEntity } from './user-profiles.entity';
import { PostsEntity } from './posts.entity';

@Entity({ name: 'post_comments' })
export class PostCommentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column()
  userId: string;

  @Column()
  postId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserProfilesEntity, ({ postComments }) => postComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => PostsEntity, ({ postComments }) => postComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
