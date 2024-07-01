// auth.dto.ts

import { IsString, IsBoolean } from 'class-validator';

// DTO para crear un nuevo usuario
export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  isAdmin?: boolean;
}

// DTO para iniciar sesión
export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
