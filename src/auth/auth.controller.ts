import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SessionService } from './session.service';



@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService, 
    private sessionService: SessionService,
  ) {}

  // auth.controller.ts
@Post('register')
register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}

@Post('login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
@UseGuards(JwtAuthGuard)
  @Post('extend-session')
  async extendSession(@Req() req: Request) {
    const user = (req as any ).User;

    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid user.');
    }

    // Generate new token
    const newToken = await this.authService.generateToken(user.id);

    // Update session with new token and activity time
    // await this.sessionService.invalidateUserSessions(user.id); // optional if only one session allowed
    // You could alternatively update existing session’s token
    await this.sessionService.updateToken(user.id, newToken);

    return { token: newToken };
}


}
   