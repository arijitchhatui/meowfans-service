import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'creator_blocks' })
export class CreatorBlocksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blockedUserId: string;

  @Column()
  blockingCreatorId: string;

  @CreateDateColumn()
  blockedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
