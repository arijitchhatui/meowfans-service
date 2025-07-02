import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
