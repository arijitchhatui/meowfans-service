import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentType, FileType } from '../../../util/enums';
import { DownloadStates } from '../../../util/enums/download-state';
import { AssetsEntity } from './assets.entity';
import { VaultsEntity } from './vaults.entity';

registerEnumType(ContentType, { name: 'ContentType' });

@ObjectType()
@Entity({ name: 'vault_objects' })
@Index('IDX_VAULT_OBJECT_URL', ['objectUrl'])
@Index('IDX_VAULT_ID', ['vaultId'])
export class VaultObjectsEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  objectUrl: string;

  @Field()
  @Column()
  vaultId: string;

  @Field(() => Number)
  @Column({ type: 'bigint', nullable: true })
  suffix: number | null;

  @Field(() => DownloadStates)
  @Column({ type: 'enum', enum: DownloadStates, enumName: 'DownloadStates', default: DownloadStates.PENDING })
  status: DownloadStates;

  @Field(() => FileType)
  @Column({ type: 'enum', enum: FileType, enumName: 'FileType', default: FileType.IMAGE })
  fileType: FileType;

  @Field(() => ContentType)
  @Column({ type: 'enum', enum: ContentType, enumName: 'ContentType', default: ContentType.SFW })
  contentType: ContentType;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToOne(() => AssetsEntity, (asset) => asset.vaultObject, { nullable: true })
  asset?: AssetsEntity | null;

  @Field(() => VaultsEntity)
  @ManyToOne(() => VaultsEntity, ({ vaultObjects }) => vaultObjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vault_id' })
  vault: VaultsEntity;
}
