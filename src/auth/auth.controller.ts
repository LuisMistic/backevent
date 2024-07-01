import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';

@Controller('auth') // Define el prefijo para las rutas en este controlador
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta POST '/auth/register'
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      // Llama al método 'register' en el servicio 'AuthService' para registrar un usuario
      const newUser = await this.authService.register(createUserDto);
      return { user: newUser }; // Retorna el usuario creado
    } catch (error) {
      // Manejo de errores si ocurre algún problema durante el registro
      return { error: error.message };
    }
  }

  // Ruta POST '/auth/login'
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      // Llama al método 'login' en el servicio 'AuthService' para iniciar sesión
      const token = await this.authService.login(loginUserDto);
      return { token }; // Retorna el token JWT generado para el usuario autenticado
    } catch (error) {
      // Manejo de errores si ocurre algún problema durante el inicio de sesión
      return { error: error.message };
    }
  }
}
