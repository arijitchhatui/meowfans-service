import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanProfilesEntity } from './fan-profiles.entity';

@ObjectType()
@Entity({ name: 'payments' })
export class PaymentsEntity {
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
  @Column()
  relatedEntityId: string;

  @Field()
  @Column()
  stripePaymentId: string;

  @Field()
  @Column()
  amountInCents: number;

  @Field()
  @Column()
  currency: string;

  @Field()
  @Column()
  status: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, ({ payments }) => payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;
}
