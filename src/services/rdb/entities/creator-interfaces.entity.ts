import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'creator_interfaces' })
export class CreatorInterfacesEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  mode: string;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @Column()
  backgroundImage: string;

  @Field()
  @Column({ default: true })
  canReceiveCall: boolean;

  @Field()
  @Column({ default: true })
  isPGFilterOn: boolean;

  @Field(() => CreatorProfilesEntity)
  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.interfaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;
}
