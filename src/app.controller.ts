import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crearUsuario(): string {
    return this.usuariosService.crearUsuario();
  }

  @Get()
  obtenerUsuarios(): string {
    return this.usuariosService.obtenerUsuarios();
  }

  @Get(':id')
  obtenerUsuarioPorId(@Param('id', ParseIntPipe) id: number): string {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }
}
