// src/auth/jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ✅ Step 1: Let Passport validate the JWT (signature, expiration)
    const canActivate = await super.canActivate(context);
    return canActivate as boolean;
  }

  handleRequest(err, user, info) {
    // ✅ Step 2: Handle invalid or missing token
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    return user; // JWT payload will be attached to `req.user`
  }
}
