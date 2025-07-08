import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'creator_blocks' })
export class CreatorBlocksEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  blockedUserId: string;

  @Field()
  @Column()
  blockingCreatorId: string;

  @Field()
  @CreateDateColumn()
  blockedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  unBlockedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ creatorBlocks }) => creatorBlocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocking_creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ blockedByCreators }) => blockedByCreators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUserProfile: UserProfilesEntity;
}
