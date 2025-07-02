import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fan_assets' })
export class FanAssetsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fanId: string;

  @Column()
  assetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
