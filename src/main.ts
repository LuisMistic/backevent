import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://casa-abierta.online', 'http://localhost:4200'], // Orígenes permitidos, incluye tu dominio de producción y local
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Habilita el uso de cookies
  });

  await app.listen(3000); // Puerto en el que escucha tu aplicación NestJS
}
bootstrap();
