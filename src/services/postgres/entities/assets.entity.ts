import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType, MediaType } from '../../../util/enums';
import { CreatorAssetsEntity } from './creator-assets.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanAssetsEntity } from './fan-assets.entity';
import { MessageAssetsEntity } from './message-assets.entity';
import { PostAssetsEntity } from './post-assets.entity';
import { VaultObjectsEntity } from './vaults-objects.entity';

registerEnumType(MediaType, { name: 'MediaType' });
registerEnumType(FileType, { name: 'FileType' });

@ObjectType()
@Entity({ name: 'assets' })
export class AssetsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  rawUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  blurredUrl: string | null;

  @Field()
  @Column({ type: 'uuid' })
  creatorId: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  vaultObjectId: string | null;

  @Field()
  @Column()
  mimeType: string;

  @Field(() => MediaType)
  @Column({ type: 'enum', enum: MediaType, enumName: 'MediaType', default: MediaType.POST_MEDIA })
  mediaType: MediaType;

  @Field(() => FileType)
  @Column({ type: 'enum', enum: FileType, enumName: 'FileType', default: FileType.IMAGE })
  fileType: FileType;

  @Column({ type: 'bigint', generated: 'increment' })
  displayOrder: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => VaultObjectsEntity, { nullable: true })
  @OneToOne(() => VaultObjectsEntity, (vaultObject) => vaultObject.asset, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vault_object_id' })
  vaultObject?: VaultObjectsEntity;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => [FanAssetsEntity])
  @OneToMany(() => FanAssetsEntity, (fanAssets) => fanAssets.asset, { cascade: true })
  fanAssets: FanAssetsEntity[];

  @Field(() => [CreatorAssetsEntity])
  @OneToMany(() => CreatorAssetsEntity, (creatorAssets) => creatorAssets.asset, { cascade: true })
  creatorAssets: CreatorAssetsEntity[];

  @Field(() => [MessageAssetsEntity])
  @OneToMany(() => MessageAssetsEntity, (messageAssets) => messageAssets.asset, { cascade: true })
  messageAssets: MessageAssetsEntity[];

  @Field(() => [PostAssetsEntity])
  @OneToMany(() => PostAssetsEntity, (postAssets) => postAssets.asset, { cascade: true })
  postAssets: PostAssetsEntity[];
}
