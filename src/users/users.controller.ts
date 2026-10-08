import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UsersService } from './users.service.js';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';
import { Role } from '../generated/prisma/enums.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { FiltroUsuarioDto } from './dto/filtro-usuario.dto.js';

type JwtUser = {
  sub: number;
  email: string;
  role: Role;
};

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Crear un usuario',
    description: 'Permite al administrador crear un nuevo usuario.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para crear usuarios.',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo electrónico ya está registrado.',
  })
  createUser(@Body() createUserDto: CrearUsuarioDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AGENTE')
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Obtiene los usuarios registrados en el sistema.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    description: 'Filtrar usuarios por rol.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para consultar usuarios.',
  })
  findAll(@Query() filtros: FiltroUsuarioDto) {
    return this.usersService.findAll(filtros.role);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener mi perfil',
    description: 'Obtiene los datos del usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  findMe(@Req() req: Request & { user: JwtUser }) {
    return this.usersService.findOne(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AGENTE')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Obtiene la información de un usuario específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para consultar este usuario.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
