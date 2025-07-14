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
import { FanProfilesEntity } from './fan-profiles.entity';

@ObjectType()
@Entity({ name: 'fan_payment_profiles' })
export class FanPaymentProfilesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @Column()
  stripeCustomerId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ fanPaymentProfiles }) => fanPaymentProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;
}
