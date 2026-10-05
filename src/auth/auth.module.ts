import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    UsuariosModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '8h',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [AuthService],
})
export class AuthModule {}
