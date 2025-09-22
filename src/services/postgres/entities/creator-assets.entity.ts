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
import { AssetType } from '../../../util/enums';
import { AssetsEntity } from './assets.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';

registerEnumType(AssetType, { name: 'AssetType' });
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

  @Field(() => AssetType)
  @Column({ default: AssetType.PRIVATE, nullable: false })
  type: AssetType;

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
