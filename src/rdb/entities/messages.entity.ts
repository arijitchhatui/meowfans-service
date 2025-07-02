import { Field, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
@Entity({ name: 'messages' })
export class MessagesEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  content: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column()
  channelId: string;

  @Field()
  @Column({ default: 0 })
  price: number;

  @Field()
  @Column({ default: false })
  isExclusive: boolean;

  @Column({ default: null })
  repliedTo: string;

  @Field()
  @Column({ default: null })
  unlockedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field()
  @ManyToOne(() => UserProfilesEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  userProfile: UserProfilesEntity;
}
