import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import { Session } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityInterceptor } from 'src/session-activity/session-activity.interceptor';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Session]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, SessionService,  {
    provide: APP_INTERCEPTOR,
    useClass: ActivityInterceptor,
  },SessionAuthGuard],
  controllers: [AuthController],
  exports: [SessionService, AuthService,SessionAuthGuard],
})
export class AuthModule {}
