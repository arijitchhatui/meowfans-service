import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'purchases' })
export class PostPurchasesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  relatedEntityId: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @CreateDateColumn()
  purchasedAt: Date;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ postPurchases }) => postPurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  userProfile: UserProfilesEntity;

  @Field(() => PostsEntity)
  @ManyToOne(() => PostsEntity, ({ postPurchases }) => postPurchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
