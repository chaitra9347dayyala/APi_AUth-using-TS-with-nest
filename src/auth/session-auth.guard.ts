import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ModuleRef } from '@nestjs/core';
import { SessionService } from './session.service';

@Injectable()
export class SessionAuthGuard extends AuthGuard('jwt') {
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest();

    // ✅ Extract and log Authorization header
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    console.log('🔑 Raw Authorization header:', authHeader);

    let token: string | undefined = undefined;

    if (authHeader && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer')) {
      // ✅ Properly slice after "Bearer" and trim
      token = authHeader.slice(6).trim();
    }

    console.log('🔐 Extracted token from header:', token);

    if (!token) {
      console.error('❌ Token not found or malformed!');
      throw new UnauthorizedException('Missing or malformed token');
    }

    // ✅ Get SessionService from DI container
    const sessionService = this.moduleRef.get(SessionService, { strict: false });
    if (!sessionService) {
      console.error('❌ SessionService not found!');
      throw new UnauthorizedException('Internal session error');
    }

    // ✅ Check session in DB
    const session = await sessionService.findSessionByToken(token);
    console.log('📦 Session from DB:', session);

    if (!session || !session.isActive) {
      console.error('❌ Session invalid or expired');
      throw new UnauthorizedException('Session expired or invalidated');
    }

    // ✅ Update last activity timestamp
    await sessionService.updateLastActivity(token);
    console.log('✅ Session is valid. Proceeding...');

    return true;
  }
}
