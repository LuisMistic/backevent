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
      host: this.configService.get('MAIL_HOST'), // Host del servidor SMTP
      port: Number(this.configService.get('MAIL_PORT')), // Puerto del servidor SMTP
      secure: true, // Usar SSL/TLS (true/false)
      auth: {
        user: this.configService.get('EMAIL_USER'), // Usuario de correo electrónico
        pass: this.configService.get('EMAIL_PASS'), // Contraseña de correo electrónico
      },
      tls: {
        rejectUnauthorized: false, // Ignorar problemas con certificados no confiables (true/false)
      },
    });
  }

  async sendRegistrationEmail(to: string, name: string) {
    try {
      this.logger.log(`Enviando correo de registro a: ${to}`);

      // Plantilla HTML del correo para el destinatario
      const htmlTemplateForRecipient = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              background-color: #ffffff; /* Fondo blanco */
              color: #000000; /* Texto negro */
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f7f7f7;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .content {
              padding: 20px;
              background-color: #ffffff;
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
              <p>Te estaremos informando a través de tu correo. Recuerda que el evento comenzará puntualmente a las 20 hs en:</p>
              <p>Casa Abierta<br>
                 Calle San Salvador 3438, Remedios de Escalada, Lanús</p>
              <p>Estamos preparando este evento inspirado en la red de amistades para encontrarse. Una noche donde seguimos conservando la llama y hoy nos toca a nosotros para generar el puente de puerta a puerta en una casa abierta. La música, la comida y lo artesanal serán la danza que nos abrace. Próximamente te pasaremos más información. Cupo limitado.</p>
            </div>
            <div class="footer">
              <p>&copy;2024 Casa Abierta</p> <p>casa-abierta.online</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Envío del correo al destinatario
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'), // Dirección de correo del remitente
        to, // Dirección de correo del destinatario
        subject: 'Confirmación de Registro', // Asunto del correo
        html: htmlTemplateForRecipient, // Plantilla HTML del correo
      });

      // Envío del correo a ti mismo
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'), // Dirección de correo del remitente
        to: 'luis.escalada21@gmail.com', // Dirección de tu correo personal
        subject: 'Nuevo Registro de Invitado', // Asunto del correo
        html: `Se ha registrado un nuevo invitado: ${name} (${to})`, // Mensaje de correo
      });

      this.logger.log(`Correos de registro enviados a: ${to} y ${'luis.escalada21@gmail.com'}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de registro a: ${to}`, error);
      throw error; // Lanza el error para manejarlo en el nivel superior si es necesario
    }
  }
}
