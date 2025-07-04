import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@Entity({ name: 'post_likes' })
export class PostLikesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserProfilesEntity, ({ postLikes }) => postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => PostsEntity, ({ postLikes }) => postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
