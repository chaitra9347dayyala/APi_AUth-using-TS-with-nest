import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDataService } from './user-data.services';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { SessionAuthGuard } from 'src/auth/session-auth.guard';
import { UsersService } from './users.service';

@Controller('user-data')
@UseGuards(JwtAuthGuard,SessionAuthGuard)
export class UserDataController {
  constructor(private readonly userDataService: UserDataService,
    private readonly UserServices: UsersService
  ) {}

@UseGuards(JwtAuthGuard, SessionAuthGuard)
@Post()
async addUserData(@Request() req, @Body() createDto: CreateUserDataDto) {
  const userId = req.user.id; 
  return await this.userDataService.addData(userId, createDto.object);
}
@UseGuards(JwtAuthGuard, SessionAuthGuard)
@Get()
async getUserData(@Request() req) {
  const userId = req.user.id;
  return await this.userDataService.getActiveDataByUser(userId);
}

@Delete(':id')
  async softDeleteUserData(
    @Request() req,
    @Param('id', ParseIntPipe) dataId: number,
  ) {
    const userId = req.user.id;
    const success = await this.userDataService.softDeleteData(userId, dataId);
    if (!success) {
      throw new HttpException('Data not found or unauthorized', HttpStatus.NOT_FOUND);
    }
    return { message: 'Data soft-deleted successfully' };
  }
 @Post('delete-many')
async softDeleteManyUserData(
  @Request() req,
  @Body() body: { ids: number[] },
) {
  const userId = req.user.id;
  const result = await this.userDataService.softDeleteManyData(userId, body.ids);

  if (!result.success) {
    throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
  }

  return { message: 'Data soft-deleted successfully' };
}


}
