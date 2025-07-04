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

@Entity({ name: 'message_assets' })
export class MessageAssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  assetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CreatorAssetsEntity, (creatorAsset) => creatorAsset.messageAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  creatorAsset: CreatorAssetsEntity;

  @ManyToOne(() => MessagesEntity, (message) => message.messageAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessagesEntity;
}
