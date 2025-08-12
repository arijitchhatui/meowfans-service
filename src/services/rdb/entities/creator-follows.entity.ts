import { Field, ObjectType } from '@nestjs/graphql';
import {
  Check,
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

@ObjectType()
@Entity({ name: 'creator_follows' })
@Index('UQ_creator_follows_fanId_creator_id', ['fanId', 'creatorId'], { unique: true })
@Check('CHK_creator_follows_fan_id_is_not_equal_to_creator_id', `"fan_id" <> "creator_id"`)
export class CreatorFollowsEntity {
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
  followedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  unFollowedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ followers }) => followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ following }) => following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;
}
