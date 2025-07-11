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
  UpdateDateColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { GroupMessageRepliesEntity } from './group-message-replies.entity';
import { GroupsEntity } from './groups.entity';
import { UserProfilesEntity } from './user-profiles.entity';

@ObjectType()
@Entity({ name: 'group_messages' })
export class GroupMessagesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  groupId: string;

  @Field()
  @Column()
  senderId: string;

  @Field(() => [UserProfilesEntity])
  @ManyToMany(() => UserProfilesEntity, (userProfiles) => userProfiles.groupReceivers, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_receivers',
    joinColumn: { name: 'group_message_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  receivers: UserProfilesEntity[];

  @Field()
  @Column()
  message: string;

  @Field()
  @Column()
  isExclusive: boolean;

  @Field()
  @Column()
  isPinned: boolean;

  @Field()
  @Column()
  unlockPrice: number;

  @Field()
  @Column()
  isCreator: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => GroupsEntity)
  @ManyToOne(() => GroupsEntity, (group) => group.groupMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: GroupsEntity;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.groupMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => [GroupMessageRepliesEntity])
  @OneToMany(() => GroupMessageRepliesEntity, (groupMessageReplies) => groupMessageReplies.groupMessage, {
    cascade: true,
  })
  groupMessageReplies: GroupMessageRepliesEntity[];
}
