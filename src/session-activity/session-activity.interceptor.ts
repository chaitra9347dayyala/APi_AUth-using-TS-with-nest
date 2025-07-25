import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SessionService } from '../auth/session.service';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(private readonly sessionService: SessionService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return next.handle(); // No token provided

    try {
      const session = await this.sessionService.findSessionByToken(token);

      if (!session || !session.isActive) {
        throw new UnauthorizedException('Session is inactive or missing.');
      }

      const now = Date.now();
      const last = new Date(session.lastActivity).getTime();
      const diffMinutes = (now - last) / (1000 * 60);

      console.log('⏱ Inactivity:', diffMinutes.toFixed(2), 'min');

      if (diffMinutes > 1) {
        await this.sessionService.invalidateSession(token);
        throw new UnauthorizedException('Session expired due to inactivity.');
      }

      // await this.sessionService.updateLastActivity(token);
    } catch (err) {
      console.error('❌ ActivityInterceptor Error:', err.message);
      throw new UnauthorizedException('Session timeout check failed.');
    }

    return next.handle();
  }
}
