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
import { CreatorAssetsEntity } from './creator-assets.entity';
import { MessagesEntity } from './messages.entity';

@ObjectType()
@Entity({ name: 'message_assets' })
export class MessageAssetsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  messageId: string;

  @Field()
  @Column()
  assetId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorAssetsEntity)
  @ManyToOne(() => CreatorAssetsEntity, (creatorAsset) => creatorAsset.messageAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  creatorAsset: CreatorAssetsEntity;

  @Field(() => MessagesEntity)
  @ManyToOne(() => MessagesEntity, (message) => message.messageAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
