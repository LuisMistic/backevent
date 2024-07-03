import { Controller, Post, Get, Put, Delete, Body, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InvitadoService } from '../invitado/invitado.service';
import { Invitado } from './invitado.entity';
import { MailService } from '../mail/mail.service'; // Asegúrate de importar correctamente el servicio de correo electrónico

@Controller('invitados')
export class InvitadoController {
  private readonly logger = new Logger(InvitadoController.name);

  constructor(
    private readonly invitadoService: InvitadoService,
    private readonly mailService: MailService, // Inyecta el servicio de correo electrónico
  ) {}

  @Post('registro')
  async registrarInvitado(@Body() invitadoData: Invitado) {
    try {
      const nuevoInvitado = await this.invitadoService.registrarInvitado(invitadoData);

      // Envío de correo electrónico al registrarse un invitado
      await this.mailService.sendRegistrationEmail(invitadoData.correo_electronico, invitadoData.nombre);
      await this.mailService.sendRegistrationEmail('luis.escalada21@gmail.com', invitadoData.nombre); // Envío a tu correo personal

      this.logger.log(`Invitado registrado: ${nuevoInvitado}`);

      return nuevoInvitado;
    } catch (error) {
      this.logger.error('Error al registrar el invitado', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocurrió un error al registrar el invitado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async obtenerInvitados() {
    try {
      return await this.invitadoService.obtenerInvitados();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocurrió un error al obtener los invitados',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async actualizarInvitado(@Param('id') id: number, @Body() invitadoData: Partial<Invitado>) {
    try {
      return await this.invitadoService.actualizarInvitado(id, invitadoData);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocurrió un error al actualizar el invitado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async eliminarInvitado(@Param('id') id: number) {
    try {
      await this.invitadoService.eliminarInvitado(id);
      return { success: true };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocurrió un error al eliminar el invitado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
