import { IsString } from 'class-validator';

export class CreateUserDataDto {
  @IsString()
  object: string;
}
