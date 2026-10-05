import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crearUsuario(createUsuarioDto);
  }

  @Get()
  obtenerUsuarios() {
    return this.usuariosService.FindAll();
  }

  @Get(':id')
  obtenerUsuarioPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }
}
