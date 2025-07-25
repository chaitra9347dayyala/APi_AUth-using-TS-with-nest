import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { ActivityInterceptor } from './session-activity/session-activity.interceptor';
import { SessionService } from './auth/session.service'; // Import your session service

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.useGlobalPipes(new ValidationPipe());

  // ✅ Get SessionService from Nest DI container
  const sessionService = app.get(SessionService);
  app.useGlobalInterceptors(new ActivityInterceptor(sessionService));

  // ✅ Database connection status
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('✅ Database connected successfully!');
  } else {
    console.error('❌ Failed to connect to the database.');
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
