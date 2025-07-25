// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  // ✅ Register method
  async register(registerDto: RegisterDto): Promise<any> {
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const role = registerDto.role === 'admin' ? 'admin' : 'user';

    const newUser = await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
      role,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  // ✅ Validate user (for login)
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const { password, ...result } = user;
    return result;
  }

  // ✅ Login method with session service
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    

    // ✅ Use SessionService instead of sessionRepository
    await this.sessionService.invalidateUserSessions(user.id); // deactivate previous
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' }); 
    await this.sessionService.createSession(user.id, token);// save new

    return {
      access_token: token,
    };
  }

  async generateToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
}
