import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
