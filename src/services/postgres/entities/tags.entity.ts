import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VaultsEntity } from './vaults.entity';

@ObjectType()
@Entity({ name: 'tags' })
@Index('IDX_TAG_LABEL', ['label'])
export class TagsEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  label: string;

  @ManyToMany(() => VaultsEntity, (vaults) => vaults.tags, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'vault_tags',
    joinColumn: { name: 'tag_id' },
    inverseJoinColumn: { name: 'vault_id' },
  })
  vaults: VaultsEntity[];
}
