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
@Entity({ name: 'creator_restricts' })
export class CreatorRestrictsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  restrictedUserId: string;

  @Field()
  @CreateDateColumn()
  restrictedAt: Date;

  @Field()
  @DeleteDateColumn({ nullable: true })
  unRestrictedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ creatorRestricts }) => creatorRestricts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => UserProfilesEntity)
  @ManyToOne(() => UserProfilesEntity, ({ restrictedByCreators }) => restrictedByCreators)
  @JoinColumn({ name: 'restricted_user_id' })
  restrictedUserProfile: UserProfilesEntity;
}
