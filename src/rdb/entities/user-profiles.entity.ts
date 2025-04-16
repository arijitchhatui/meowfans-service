import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@ObjectType()
@Entity({ name: 'user_profiles' })
export class UserProfilesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Field(() => UsersEntity)
  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Index()
  user: UsersEntity;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column({ nullable: true })
  bio: string;

  @Field()
  @Column({ nullable: true })
  avatarUrl: string;

  @Field()
  @Column({ nullable: true })
  bannerUrl: string;

  @Field()
  @Column({ nullable: true })
  websiteUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
