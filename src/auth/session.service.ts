// src/auth/session.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SessionService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  // ✅ Create a new active session
  async createSession(userId: number, token: string) {
    console.log('📥 Saving session:', { userId, token });
    const session = this.sessionRepo.create({
      userId,
      token,
      isActive: true,
      lastActivity: new Date(),
    });
    return await this.sessionRepo.save(session);
  }

  // ✅ Find an active session by token
  async findSessionByToken(token: string): Promise<Session | null> {
    return this.sessionRepo.findOne({
      where: { token, isActive: true },
    });
  }

  // ✅ Update session activity time
  async updateLastActivity(token: string) {
    await this.sessionRepo.update({ token }, { lastActivity: new Date() });
  }

  // ✅ Invalidate a specific token
  async invalidateSession(token: string) {
    await this.sessionRepo.update({ token }, { isActive: false });
  }

  // ✅ Invalidate all active sessions for a user (main logout/login log
  async invalidateUserSessions(userId: number) {
    await this.sessionRepo.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  // ❌ Remove: token update logic is not used if we're always creating new sessions
  // But if needed, you can still keep this:
  async updateToken(userId: number, newToken: string) {
    await this.sessionRepo.update(
      { userId, isActive: true },
      {
        token: newToken,
        lastActivity: new Date(),
      },
    );
  }
}
