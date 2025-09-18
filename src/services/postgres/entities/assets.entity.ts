import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreatorAssetsEntity } from './creator-assets.entity';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { FanAssetsEntity } from './fan-assets.entity';
import { MessageAssetsEntity } from './message-assets.entity';
import { PostAssetsEntity } from './post-assets.entity';
import { FileType, MediaType } from '../../../util/enums';

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

  @Field()
  @Column()
  blurredUrl: string;

  @Field()
  @Column({ type: 'uuid' })
  creatorId: string;

  @Field()
  @Column()
  mimeType: string;

  @Field(() => MediaType)
  @Column({ type: 'enum', enum: MediaType, enumName: 'MediaType', default: MediaType.POST_MEDIA })
  mediaType: MediaType;

  @Field(() => FileType)
  @Column({ type: 'enum', enum: FileType, enumName: 'FileType', default: FileType.IMAGE })
  fileType: FileType;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

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
