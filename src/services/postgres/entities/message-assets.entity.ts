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
import { MessagesEntity } from './messages.entity';
import { AssetsEntity } from './assets.entity';

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

  @Field(() => AssetsEntity)
  @ManyToOne(() => AssetsEntity, (asset) => asset.messageAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetsEntity;

  @Field(() => MessagesEntity)
  @ManyToOne(() => MessagesEntity, (message) => message.messageAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
