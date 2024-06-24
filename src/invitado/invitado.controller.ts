import { Controller, Post, Get, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InvitadoService } from '../invitado/invitado.service';
import { Invitado } from './invitado.entity';

@Controller('invitados')
export class InvitadoController {
  constructor(private readonly invitadoService: InvitadoService) {}

  @Post('registro')
  async registrarInvitado(@Body() invitadoData: Invitado) {
    try {
      const nuevoInvitado = await this.invitadoService.registrarInvitado(invitadoData);
      return nuevoInvitado;
    } catch (error) {
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
