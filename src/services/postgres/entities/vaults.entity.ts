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

  @OneToMany(() => VaultObjectsEntity, ({ vault }) => vault, { cascade: true })
  vaultObjects: VaultObjectsEntity[];
}
