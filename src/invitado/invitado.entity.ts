import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Invitado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo_electronico: string;

  @Column()
  numero_invitacion: number;

  @Column()
  observaciones: string;


  // Otros campos y métodos si es necesario
}
