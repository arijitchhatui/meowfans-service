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
import { AssetsEntity } from './assets.entity';
import { FanProfilesEntity } from './fan-profiles.entity';

@Entity({ name: 'fan_assets' })
@Index('IDX_FAN_ASSETS_FAN_ID', ['fanId'])
@Index('IDX_FAN_ASSETS_ASSET_ID', ['assetId'])
@ObjectType()
export class FanAssetsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fanId: string;

  @Field()
  @Column()
  assetId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => FanProfilesEntity)
  @ManyToOne(() => FanProfilesEntity, (fanProfile) => fanProfile.fanAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fanProfile: FanProfilesEntity;

  @Field(() => AssetsEntity)
  @ManyToOne(() => AssetsEntity, (assets) => assets.fanAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetsEntity;
}
