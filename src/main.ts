import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS si es necesario
  app.enableCors({
    origin: ['https://casa-abierta.online', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración del puerto
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT); // Escucha en el puerto asignado
}

bootstrap();
