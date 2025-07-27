import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { JwtUser } from '../../auth';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanProfilesEntity } from './fan-profiles.entity';

enum UserRoles {
  FAN = 'fan',
  ADMIN = 'admin',
  SUPER_VIEWER = 'super_viewer',
  CREATOR = 'creator',
}
registerEnumType(UserRoles, { name: 'UserRoles' });

@ObjectType()
@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field()
  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ default: 'Swift' })
  firstName: string;

  @Field()
  @Column({ default: 'Send' })
  lastName: string;

  @Field()
  @Column({ default: 'username' })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrl: string;

  @Field(() => [UserRoles])
  @Column('text', { array: true, default: [UserRoles.FAN] })
  roles: UserRoles[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true, default: null })
  lastLoginAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => FanProfilesEntity)
  @OneToOne(() => FanProfilesEntity, (fanProfile) => fanProfile.user, { cascade: true })
  fanProfile: FanProfilesEntity;

  @Field(() => CreatorProfilesEntity)
  @OneToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.user, { cascade: true })
  creatorProfile: CreatorProfilesEntity;

  static isFan(user: UsersEntity | JwtUser): boolean {
    return user.roles.includes(UserRoles.FAN) ?? false;
  }

  static isCreator(user: UsersEntity | JwtUser): boolean {
    return user.roles.includes(UserRoles.CREATOR) ?? false;
  }

  static isAdmin(user: UsersEntity | JwtUser): boolean {
    return user.roles.includes(UserRoles.ADMIN) ?? false;
  }

  static isSuperViewer(user: UsersEntity | JwtUser): boolean {
    return user.roles.includes(UserRoles.SUPER_VIEWER) ?? false;
  }
}
