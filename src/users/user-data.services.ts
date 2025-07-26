import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from './user-entities/users_data.entity';
import { User } from './user-entities/users.entity';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(UserData)
    private userDataRepository: Repository<UserData>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ➕ Add user data (object)
  async addData(userId: number, object: string): Promise<UserData> {
    const existing = await this.userDataRepository.findOne({
      where: {
        user: { id: userId },
        object: object,
      },
      relations: ['user'],
    });

    if (existing) {
      throw new Error('Duplicate data: user already added this object');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newData = this.userDataRepository.create({
      user:{ id: userId },
      object,
      isActive: true,
    });

    const savedData = await this.userDataRepository.save(newData);

    user.totalAdded += 1;
    await this.userRepository.save(user);

    return savedData;
  }

  // 📄 Get all active data for a user
  async getActiveDataByUser(userId: number): Promise<UserData[]> {
    return await this.userDataRepository.find({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: ['user'],
    });
  }

  // 🗑️ Soft delete data (mark inactive)
  async softDeleteData(userId: number, dataId: number): Promise<boolean> {
    const data = await this.userDataRepository.findOne({
      where: {
        id: dataId,
        user: { id: userId },
        isActive: true,
      },
      relations: ['user'],
    });

    if (!data) {
      return false;
    }

    data.isActive = false;
    await this.userDataRepository.save(data);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.totalDeleted += 1;
      await this.userRepository.save(user);
    }

    return true;
  }

  // ✅ Admin: Get all user data (active + inactive)
  async getAllUserData(): Promise<UserData[]> {
    return await this.userDataRepository.find({
      relations: ['user'],
      order: {
        user: {
          id: 'ASC',
        },
        id: 'ASC',
      },
    });
  }

  // ✅ Admin: Get specific user's data (active + inactive)
  async getUserDataIncludingInactive(userId: number): Promise<UserData[]> {
    return await this.userDataRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
      order: { id: 'ASC' },
    });
  }
}
