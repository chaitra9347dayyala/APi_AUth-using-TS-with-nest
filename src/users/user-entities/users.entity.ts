import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserData } from '../user-entities/users_data.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  profession: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 0 })
  totalAdded: number;

  @Column({ default: 0 })
  totalDeleted: number;

  @OneToMany(() => UserData, (userData) => userData.user)
  userData: UserData[];
}

