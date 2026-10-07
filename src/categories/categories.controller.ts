import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../generated/prisma/enums.js';

import { Roles } from '../auth/decorator/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ActualizarCategoryDto } from './dto/actualizar-category.dto.js';
import { CrearCategoryDto } from './dto/crear-category.dto.js';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }
  @Post()
  @Roles(Role.ADMIN, Role.AGENTE)
  create(@Body() crearCategoryDto: CrearCategoryDto) {
    return this.categoriesService.create(crearCategoryDto);
  }
  @Patch(':id')
  @Roles(Role.ADMIN, Role.AGENTE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarCategoryDto: ActualizarCategoryDto,
  ) {
    return this.categoriesService.update(id, actualizarCategoryDto);
  }
  @Delete(':id')
  @Roles(Role.ADMIN, Role.AGENTE)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
