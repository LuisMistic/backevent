import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Invitado } from './invitado.entity';

@Injectable()
export class InvitadoService {
  private readonly logger = new Logger(InvitadoService.name);

  constructor(
    @InjectRepository(Invitado)
    private readonly invitadoRepository: Repository<Invitado>,
  ) {}

  async registrarInvitado(invitadoData: Invitado): Promise<Invitado> {
    try {
      this.logger.log('Intentando registrar invitado:', invitadoData);
      
      const lastInvitado = await this.invitadoRepository.find({
        order: { numero_invitacion: 'DESC' },
        take: 1,
      });
      const lastNumber = lastInvitado.length > 0 ? lastInvitado[0].numero_invitacion : 0;
      invitadoData.numero_invitacion = lastNumber + 1;

      const nuevoInvitado = await this.invitadoRepository.save(invitadoData);
      this.logger.log('Invitado registrado:', nuevoInvitado);
      return nuevoInvitado;
    } catch (error) {
      this.logger.error('Error registrando invitado:', error);
      throw error;
    }
  }

  async obtenerInvitados(): Promise<Invitado[]> {
    try {
      this.logger.log('Obteniendo todos los invitados');
      return await this.invitadoRepository.find();
    } catch (error) {
      this.logger.error('Error obteniendo invitados:', error);
      throw error;
    }
  }

  async actualizarInvitado(id: number, invitadoData: Partial<Invitado>): Promise<Invitado | undefined> {
    try {
      this.logger.log(`Actualizando invitado con ID: ${id}`, invitadoData);
      await this.invitadoRepository.update(id, invitadoData);
      return this.findById(id); // Usamos findById en lugar de findOne
    } catch (error) {
      this.logger.error(`Error actualizando invitado con ID: ${id}`, error);
      throw error;
    }
  }

  async findInvitadoWithOptions(options: FindOneOptions<Invitado>): Promise<Invitado | undefined> {
    try {
      this.logger.log('Buscando invitado con opciones:', options);
      return this.invitadoRepository.findOne(options);
    } catch (error) {
      this.logger.error('Error buscando invitado con opciones:', error);
      throw error;
    }
  }

  async findInvitadoById(id: number): Promise<Invitado | undefined> {
    try {
      this.logger.log(`Buscando invitado con ID: ${id}`);
      return this.findById(id); // Usamos findById en lugar de findOne
    } catch (error) {
      this.logger.error(`Error buscando invitado con ID: ${id}`, error);
      throw error;
    }
  }

  async eliminarInvitado(id: number): Promise<void> {
    try {
      this.logger.log(`Eliminando invitado con ID: ${id}`);
      await this.invitadoRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error eliminando invitado con ID: ${id}`, error);
      throw error;
    }
  }

  private async findById(id: number): Promise<Invitado | undefined> {
    try {
      this.logger.log(`Buscando invitado por ID: ${id}`);
      return this.invitadoRepository.findOne({ where: { id } }); // Pasamos el id como parte de las opciones
    } catch (error) {
      this.logger.error(`Error buscando invitado por ID: ${id}`, error);
      throw error;
    }
  }
}
