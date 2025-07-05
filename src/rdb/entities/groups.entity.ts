import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { GroupMessagesEntity } from './group-messages.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'groups' })
export class GroupsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  adminId: string;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.groups)
  @JoinColumn({ name: 'admin_id' })
  admin: CreatorProfilesEntity;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  groupName: string;

  @Field()
  @Column()
  iconUrl: string;

  @Field()
  @Column()
  bannerUrl: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field()
  @Column()
  isPinned: boolean;

  @Field()
  @Column()
  isMuted: boolean;

  @Field()
  @Column()
  isRestricted: boolean;

  @Field()
  @Column()
  isBlocked: boolean;

  @Field()
  @Column()
  backgroundColor: string;

  @Field(() => [UserProfilesEntity])
  @ManyToMany(() => UserProfilesEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_participants',
    joinColumn: { name: 'group_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  participants: UserProfilesEntity[];

  @Field(() => [UserProfilesEntity])
  @ManyToMany(() => UserProfilesEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_moderators',
    joinColumn: { name: 'group_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  moderators: UserProfilesEntity[];

  @Field(() => [GroupMessagesEntity])
  @OneToMany(() => GroupMessagesEntity, (groupMessages) => groupMessages.group, { cascade: true })
  groupMessages: GroupMessagesEntity[];
}
