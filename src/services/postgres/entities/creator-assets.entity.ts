import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetsEntity } from './assets.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { AssetTypes } from '../../../util/enums';

registerEnumType(AssetTypes, { name: 'AssetTypes' });
@ObjectType()
@Entity({ name: 'creator_assets' })
export class CreatorAssetsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  assetId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => AssetTypes)
  @Column({ default: AssetTypes.PRIVATE, nullable: false })
  type: AssetTypes;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.creatorAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => AssetsEntity)
  @ManyToOne(() => AssetsEntity, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetsEntity;
}
