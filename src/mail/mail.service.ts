import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: Number(this.configService.get('MAIL_PORT')),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to,
      subject,
      html,
    });
  }

  async sendRegistrationEmail(to: string, name: string) {
    try {
      this.logger.log(`Enviando correo de registro a: ${to}`);

      const htmlTemplateForRecipient = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              background-color: #f2f2f2;
              color: #333;
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              text-align: center;
              padding: 20px;
              background: linear-gradient(135deg, #ff4081, #ff80ab);
              color: white;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
            }
            .content p {
              margin: 10px 0;
              line-height: 1.6;
            }
            .button-container {
              text-align: center;
              margin-top: 20px;
            }
            .button {
              background-color: #ff4081;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              text-decoration: none;
              font-size: 16px;
              transition: background-color 0.3s;
            }
            .button:hover {
              background-color: #ff80ab;
            }
            .footer {
              text-align: center;
              padding: 10px;
              font-size: 14px;
              color: #777;
              background-color: #f9f9f9;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
            }
            .footer p {
              margin: 5px 0;
            }
            .footer a {
              color: #ff4081;
              text-decoration: none;
              transition: color 0.3s;
            }
            .footer a:hover {
              color: #ff80ab;
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
              <p><strong>Casa Abierta</strong><br>
                 Calle San Salvador 3438, Remedios de Escalada, Lanús</p>
              <p>Estamos preparando este evento inspirado en la red de amistades para encontrarse. Una noche donde seguimos conservando la llama y hoy nos toca a nosotros para generar el puente de puerta a puerta en una casa abierta. La música, la comida y lo artesanal serán la danza que nos abrace. Próximamente te pasaremos más información. Cupo limitado.</p>
              <div class="button-container">
                <a href="https://casa-abierta.online" class="button">Ir a la Página</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 Casa Abierta</p>
              <p><a href="https://casa-abierta.online">casa-abierta.online</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.sendEmail(to, 'Confirmación de Registro', htmlTemplateForRecipient);
      await this.sendEmail('luis.escalada21@gmail.com', 'Nuevo Registro de Invitado', `Se ha registrado un nuevo invitado: ${name} (${to})`);

      this.logger.log(`Correos de registro enviados a: ${to} y ${'luis.escalada21@gmail.com'}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de registro a: ${to}`, error);
    }}}