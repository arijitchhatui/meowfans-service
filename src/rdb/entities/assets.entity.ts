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

@Entity({ name: 'assets' })
export class AssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rawUrl: string;

  @Column()
  blurredUrl: string;

  @Column()
  creatorId: string;

  @Column()
  type: string;

  @Column()
  mimeType: string;

  @Column()
  contentType: string;

  @Column({ default: false })
  isVideo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @JoinColumn({ name: 'creator_id' })
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.assets, { onDelete: 'CASCADE' })
  creatorProfile: CreatorProfilesEntity;
}
