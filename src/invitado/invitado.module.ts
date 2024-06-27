import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitadoController } from './invitado.controller';
import { InvitadoService } from './invitado.service';
import { Invitado } from './invitado.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invitado]), MailModule],
  controllers: [InvitadoController],
  providers: [InvitadoService],
})
export class InvitadoModule {}
