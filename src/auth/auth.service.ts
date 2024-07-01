import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Auth> {
    const { username, password, isAdmin } = createUserDto;

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.authRepository.create({
      username,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    return await this.authRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { username, password } = loginUserDto;

    const user = await this.authRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload = { username: user.username, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch (err) {
      return false;
    }
  }
}
