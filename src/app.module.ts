import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitadoModule } from './invitado/invitado.module';
import { Invitado } from './invitado/invitado.entity';
import { MailModule } from './mail/mail.module';
import { ConfigController } from './config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        // Imprimir variables de entorno para verificación
        console.log({
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        });

        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT'), 10),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [Invitado],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    InvitadoModule,
    MailModule,
  ],
  controllers: [ConfigController],
})
export class AppModule {}
