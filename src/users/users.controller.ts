import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createUser(@Body() createUserDto: CrearUsuarioDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AGENTE')
  findAll(@Query() filtros: FiltroUsuarioDto) {
    return this.usersService.findAll(filtros.role);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Req() req: Request & { user: JwtUser }) {
    return this.usersService.findOne(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AGENTE')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

}
