import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Configurar el transporte SMTP
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: Number(this.configService.get('MAIL_PORT')),
      secure: true, // true para usar SSL/TLS
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false, // Ignorar problemas con certificados no confiables
      },
    });

    // Configurar el motor de plantillas Handlebars
    this.transporter.use('compile', hbs({
      viewEngine: {
        extname: '.hbs', // extensión de los archivos de plantilla
        layoutsDir: path.resolve(__dirname, '..', 'templates'), // directorio de plantillas
        defaultLayout: false, // no usar un diseño predeterminado
      },
      viewPath: path.resolve(__dirname, '..', 'templates'),
      extName: '.hbs',
    }));
  }

  async sendRegistrationEmail(to: string, name: string) {
    try {
      this.logger.log(`Enviando correo de registro a: ${to}`);

      // Envío del correo utilizando Nodemailer
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'), // Dirección de correo del remitente
        to, // Dirección de correo del destinatario
        subject: 'Confirmación de Registro', // Asunto del correo
        template: 'registration', // Nombre de la plantilla Handlebars (sin extensión)
        context: { name }, // Datos que se pasan a la plantilla Handlebars
      });

      this.logger.log(`Correo de registro enviado a: ${to}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de registro a: ${to}`, error);
      throw error; // Lanza el error para manejarlo en el nivel superior si es necesario
    }
  }
}
