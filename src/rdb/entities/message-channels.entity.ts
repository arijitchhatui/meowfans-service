import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message_channels' })
export class MessageChannelsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  fanId: string;

  @Column()
  creatorLastSeenAt: Date;

  @Column()
  fanLastSeenAt: Date;

  @Column()
  creatorLastSentAt: Date;

  @Column()
  fanLastSentAt: Date;

  @Column()
  isPinned: boolean;

  @Column()
  label: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
