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

@Entity({ name: 'creator_restricts' })
@Index('IDX_CREATOR_RESTRICTS_CREATOR_ID', ['creatorId'])
@Index('IDX_CREATOR_RESTRICTS_FAN_ID', ['fanId'])
@Index('IDX_CREATOR_RESTRICTS_FAN_ID_CREATOR_ID', ['fanId', 'creatorId'])
@ObjectType()
export class CreatorRestrictsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @CreateDateColumn()
  restrictedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  unRestrictedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ creatorRestricts }) => creatorRestricts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ restrictedByCreators }) => restrictedByCreators)
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;
}
