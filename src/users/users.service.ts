// src/users/users.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user-entities/users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.repo.findOne({
        where: [{ username: userData.username }, { email: userData.email }],
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }

      const user = this.repo.create(userData);
      return await this.repo.save(user);
    } catch (err) {
      console.error('Error in UsersService.createUser:', err);
      throw new InternalServerErrorException('User creation failed');
    }
  }

 
  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }


 
  async getAll(): Promise<User[]> {
    return this.repo.find({
    where: {
      activeuser: true,
    },
  });
  }


  
  async getById(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  
  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    Object.assign(user, updateData);
    return this.repo.save(user);
  }
  async updateUserRole(userId: number, newRole: string): Promise<User> {
  const user = await this.repo.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  user.role = newRole;
  return this.repo.save(user);
}
async softDeleteUser(id: number): Promise<string> {
    const user = await this.repo.findOne({ where: { id, activeuser: true} });
    if (!user) throw new NotFoundException('User not found or already deleted.');

    user.activeuser = false;
    await this.repo.save(user);

    return `User ${id} soft deleted successfully.`;
  }
}
