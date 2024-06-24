import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitadoModule } from './invitado/invitado.module';
import { Invitado } from './invitado/invitado.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '*Luis3175',
      database: 'evento',
      entities: [Invitado],
      synchronize: true,
    }),
    InvitadoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
