import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitadoModule } from './invitado/invitado.module';
import { Invitado } from './invitado/invitado.entity';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQLHOST'), // Usar el host privado
        port: parseInt(configService.get('MYSQLPORT'), 10), // Puerto 3306
        username: configService.get('MYSQLUSER'), // Usuario root
        password: configService.get('MYSQL_ROOT_PASSWORD'), // Contraseña
        database: configService.get('MYSQL_DATABASE'), // Nombre de la base de datos
        entities: [Invitado],
        synchronize: true, // Cambia a false en producción
      }),
      inject: [ConfigService],
    }),
    InvitadoModule,
    MailModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
