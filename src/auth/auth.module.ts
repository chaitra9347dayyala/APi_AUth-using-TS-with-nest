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
import { User } from '../users/user-entities/users.entity'; // ✅ Needed for SessionService
import { UserData } from '../users/user-entities/users_data.entity'; // optional if you reference it

@Module({
  imports: [
    ConfigModule,
    UsersModule,

    TypeOrmModule.forFeature([Session, User]), // ✅ Needed for session+user mapping

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    SessionService,
    SessionAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityInterceptor,
    },
  ],
  controllers: [AuthController],
  exports: [SessionService, AuthService, SessionAuthGuard],
})
export class AuthModule {}
