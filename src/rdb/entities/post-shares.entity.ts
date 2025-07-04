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

  @ManyToOne(() => UserProfilesEntity, ({ postShares }) => postShares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => PostsEntity, ({ postShares }) => postShares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
