import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'creator_follows' })
export class CreatorFollowsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followingUserId: string;

  @Column()
  followedCreatorId: string;

  @CreateDateColumn()
  followedAt: Date;

  @DeleteDateColumn({ nullable: true })
  unFollowedAt: Date;
}
