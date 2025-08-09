import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PostTypes } from '../../service.constants';

registerEnumType(PostTypes, { name: 'PostTypes' });

@ObjectType()
export class PostsRawEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  caption: string;

  @Field()
  @Column({ type: 'uuid' })
  creatorId: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  unlockPrice: number | null;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  likeCount: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  saveCount: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  shareCount: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  commentCount: number;

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  totalEarning: number;

  @Field(() => [PostTypes])
  @Column('text', { array: true, default: [PostTypes.EXCLUSIVE] })
  types: PostTypes[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
