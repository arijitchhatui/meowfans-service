import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanProfilesEntity } from './fan-profiles.entity';

@Entity({ name: 'creator_blocks' })
@Index('IDX_CREATOR_BLOCKS_FAN_ID', ['fanId'])
@Index('IDX_CREATOR_BLOCKS_CREATOR_ID', ['creatorId'])
@Index('IDX_CREATOR_BLOCKS_CREATOR_ID_FAN_ID', ['creatorId', 'fanId'], { unique: true })
@ObjectType()
export class CreatorBlocksEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @CreateDateColumn()
  blockedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  unBlockedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ creatorBlocks }) => creatorBlocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ blockedByCreators }) => blockedByCreators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;
}
