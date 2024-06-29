import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
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
  }

  async sendRegistrationEmail(to: string, name: string) {
    try {
      this.logger.log(`Enviando correo de registro a: ${to}`);

      // Plantilla HTML del correo
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Inscripción</title>
          <style>
            body {
              background-color: #000000; /* Fondo negro */
              color: #ffffff; /* Texto blanco */
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #1a1a1a; /* Fondo gris oscuro */
              border-radius: 10px;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .content {
              padding: 20px;
              background-color: #333333; /* Fondo gris */
              border-radius: 10px;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por inscribirte al evento, ${name}!</h1>
            </div>
            <div class="content">
              <p>Te estaremos informando a través de tu correo. Hay capacidad limitada, esperamos verte.</p>
              <p>Estamos preparando este evento inspirado en la red de amistades que tejen a través de los tiempos el máximo valuarte que tenemos: Encontrarse. Una noche donde seguimos conservando la llama para que nunca se apague y hoy nos toca a nosotros para generar el puente de puerta a puerta en una casa abierta. La música, la comida y lo artesanal serán la danza que nos abrace. Próximamente te pasaremos más información. Capacidad limitada.</p>
            </div>
            <div class="footer">
              <p>&copy;2024 Casa Abierta</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Envío del correo utilizando Nodemailer
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'), // Dirección de correo del remitente
        to, // Dirección de correo del destinatario
        subject: 'Confirmación de Registro', // Asunto del correo
        html: htmlTemplate, // Plantilla HTML del correo
      });

      this.logger.log(`Correo de registro enviado a: ${to}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de registro a: ${to}`, error);
      throw error; // Lanza el error para manejarlo en el nivel superior si es necesario
    }
  }
}
