// src/auth/dto/register.dto.ts
import { IsEmail, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsInt()
  @Min(5)
  @Max(100)
  age: number;

  @IsString()
  gender: string;

  @IsString()
  profession: string;

  @IsOptional()
  @IsString()
  role?: string;
}
