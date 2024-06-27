import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { join } from 'path'; // Para manejar rutas de archivos
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'), // Configura el host del servidor SMTP
          port: configService.get('MAIL_PORT'), // Configura el puerto del servidor SMTP
          secure: false, // Puede ser true o false dependiendo del servidor SMTP
          auth: {
            user: configService.get('EMAIL_USER'), // Usuario de correo electrónico
            pass: configService.get('EMAIL_PASS'), // Contraseña del correo electrónico
          },
          tls: {
            rejectUnauthorized: false, // Ignora los certificados autofirmados (puede ser necesario en desarrollo)
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('EMAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'templates'), // Verifica que apunte correctamente a la carpeta de plantillas
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
