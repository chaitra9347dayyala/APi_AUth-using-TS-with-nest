// src/users/users.controller.ts
import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  userRepository: any;
  constructor(private usersService: UsersService) {}

  // ✅ Admin-only: View all users
   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admin can access this route
  @Get()
  findAll() {
    return this.usersService.getAll();
  }

  // ✅ Authenticated: View own profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    
if (!req.user) {
  throw new UnauthorizedException('User not authenticated');
}

    const userId = req.user['sub'];
    return this.usersService.getById(userId);
  }

  // ✅ Authenticated: Edit own profile
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    
if (!req.user) {
  throw new UnauthorizedException('User not authenticated');
}

    const userId = req.user['sub'];
    return this.usersService.updateUser(userId, dto);
  }
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles('admin')
@Patch('update-role/:id')
changeUserRole(
  @Param('id') id: number,
  @Body() dto: UpdateRoleDto,
) {
  return this.usersService.updateUserRole(+id, dto.role);

}
}
