// src/auth/entities/session.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity('sessions') // make sure the table name matches exactly
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
lastActivity: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  
}
