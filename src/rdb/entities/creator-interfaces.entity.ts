import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatorProfilesEntity } from './creator-profiles.entity';

@Entity({ name: 'creator_interfaces' })
export class CreatorInterfacesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mode: string;

  @Column()
  creatorId: string;

  @Column()
  backgroundImage: string;

  @Column({ default: true })
  canReceiveCall: boolean;

  @Column({ default: true })
  isPGFilterOn: boolean;

  @ManyToOne(() => CreatorProfilesEntity, (creatorProfile) => creatorProfile.interfaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creatorProfile: CreatorProfilesEntity;
}
