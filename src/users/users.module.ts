import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user-entities/users.entity';
import { UserData } from './user-entities/users_data.entity';
import { UserDataService } from './user-data.services';
import { UserDataController } from './user-data.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserData])], // ✅ Both entities
  providers: [UsersService, UserDataService],
  controllers: [UsersController, UserDataController],
  exports: [UsersService, UserDataService],
})
export class UsersModule {}
