import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfilesEntity } from './user-profiles.entity';
import { PostsEntity } from './posts.entity';

@Entity({ name: 'purchases' })
export class PostPurchasesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  relatedEntityId: string;

  @Column()
  fanId: string;

  @CreateDateColumn()
  purchasedAt: Date;

  @ManyToOne(() => UserProfilesEntity, ({ postPurchases }) => postPurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @ManyToOne(() => PostsEntity, ({ postPurchases }) => postPurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
