import { Entity, Column, PrimaryGeneratedColumn, OneToMany, IsNull } from 'typeorm';
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

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  addressline1:string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;
  
  @Column({ default: 'user' })
  role: string;

  @Column({ default: 0 })
  totalAdded: number;

  @Column({ default: 0 })
  totalDeleted: number;

  @Column({default:true})
  activeuser: boolean;

  @OneToMany(() => UserData, (userData) => userData.user)
  userData: UserData[];
}

