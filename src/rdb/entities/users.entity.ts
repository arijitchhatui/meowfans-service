import { Field, ObjectType } from '@nestjs/graphql';
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
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanProfilesEntity } from './fan-profiles.entity';

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
  @Column({ default: false })
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

  @Field(() => FanProfilesEntity)
  @OneToOne(() => FanProfilesEntity, (fanProfile) => fanProfile.user, { cascade: true })
  fanProfile: FanProfilesEntity;

  @Field(() => CreatorProfilesEntity)
  @OneToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.user, { cascade: true })
  creatorProfile: CreatorProfilesEntity;
}
