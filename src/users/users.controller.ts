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
  Delete,
  Post,
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
import { RegisterDto } from 'src/auth/dto/register.dto';

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

  
  @UseGuards( JwtAuthGuard,SessionAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user['id'];
    return this.usersService.getById(userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user['id'];
    return this.usersService.updateUser(userId, dto);
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('update-role/:id')
  changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.usersService.updateUserRole(id, dto.role);
  }

  
  @UseGuards(JwtAuthGuard, SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/data')
  getAllUserData() {
    return this.userDataService.getAllUserData();
  }

  @UseGuards(JwtAuthGuard, SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/data/:userId')
  getUserDataById(@Param('userId', ParseIntPipe) userId: number) {
    return this.userDataService.getUserDataIncludingInactive(userId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.softDeleteUser(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
@Post('register')
async adminRegistersUser(@Body() dto: RegisterDto) {
  return await this.usersService.createUser(dto);
}
}
