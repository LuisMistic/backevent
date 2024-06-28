import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('db')
  getDatabaseConfig() {
    return {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<string>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
    };
  }
}
