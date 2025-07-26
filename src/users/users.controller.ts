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
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SessionAuthGuard } from 'src/auth/session-auth.guard';
import { UserDataService } from './user-data.services';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userDataService: UserDataService,
  ) {}

  // ✅ Admin-only: View all users with stats
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.getAll();
  }

  // ✅ Authenticated: View own profile
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
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

  // ✅ Admin-only: Change a user's role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('update-role/:id')
  changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.usersService.updateUserRole(id, dto.role);
  }

  // ✅ Admin-only: Get all user data (active + inactive)
  @UseGuards(JwtAuthGuard, SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/data')
  getAllUserData() {
    return this.userDataService.getAllUserData();
  }

  // ✅ Admin-only: Get specific user's data (active + inactive)
  @UseGuards(JwtAuthGuard, SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/data/:userId')
  getUserDataById(@Param('userId', ParseIntPipe) userId: number) {
    return this.userDataService.getUserDataIncludingInactive(userId);
  }
}
