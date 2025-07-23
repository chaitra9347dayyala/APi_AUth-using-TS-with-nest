import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.useGlobalPipes(new ValidationPipe());
  const dataSource = app.get(DataSource);
if (dataSource.isInitialized) {
    console.log('✅ Database connected successfully!');
  } else {
    console.error('❌ Failed to connect to the database.');
  }


  await app.listen(process.env.PORT ?? 3000);
  console.log(`server is running on port 3000`);
}
bootstrap();
