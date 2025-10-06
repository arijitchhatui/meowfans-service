import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DownloadStates } from '../../../util/enums/download-state';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { VaultObjectsEntity } from './vaults-objects.entity';

registerEnumType(DownloadStates, { name: 'DownloadStates' });
@ObjectType()
@Entity({ name: 'vaults' })
@Index('IDX_VAULT_URL', ['url'])
@Index('IDX_CREATOR_ID', ['creatorId'])
@Index('IDX_VAULTS_KEYWORDS_GIN', ['keywords'])
export class VaultsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  creatorId: string;

  @Field()
  @Column()
  url: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => [String], { nullable: true })
  @Column('jsonb', { nullable: true })
  keywords: string[];

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, ({ vaults }) => vaults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;

  @Field(() => [VaultObjectsEntity])
  @OneToMany(() => VaultObjectsEntity, ({ vault }) => vault, { cascade: true })
  vaultObjects: VaultObjectsEntity[];
}
