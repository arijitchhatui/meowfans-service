import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({ name: 'sessions' })
export class SessionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UsersEntity, ({ sessionUser }) => sessionUser, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column()
  ip: string;

  @Column()
  userAgent: string;
}
