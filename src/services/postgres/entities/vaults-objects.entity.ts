import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DownloadStates } from '../../../util/enums/download-state';
import { VaultsEntity } from './vaults.entity';

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

  @Field(() => DownloadStates)
  @Column({ type: 'enum', enum: DownloadStates, enumName: 'DownloadStates', default: DownloadStates.PENDING })
  status: DownloadStates;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Field(() => VaultsEntity)
  @ManyToOne(() => VaultsEntity, ({ vaultObjects }) => vaultObjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vault_id' })
  vault: VaultsEntity;
}
