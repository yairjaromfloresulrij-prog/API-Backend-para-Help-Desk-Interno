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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ActualizarCategoryDto } from './dto/actualizar-category.dto.js';
import { CrearCategoryDto } from './dto/crear-category.dto.js';
import { CategoriesService } from './categories.service.js';

@ApiTags('Categorías')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar categorías',
    description: 'Obtiene todas las categorías registradas en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener categoría por ID',
    description: 'Obtiene una categoría específica mediante su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.AGENTE)
  @ApiOperation({
    summary: 'Crear una categoría',
    description:
      'Permite a un administrador o agente crear una nueva categoría.',
  })
  @ApiBody({
    type: CrearCategoryDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de categoría',
        value: {
          name: 'Impresoras',
          description:
            'Problemas relacionados con impresoras y dispositivos de impresión.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para crear categorías.',
  })
  @ApiResponse({
    status: 409,
    description: 'La categoría ya existe.',
  })
  create(@Body() crearCategoryDto: CrearCategoryDto) {
    return this.categoriesService.create(crearCategoryDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.AGENTE)
  @ApiOperation({
    summary: 'Actualizar una categoría',
    description:
      'Permite a un administrador o agente actualizar una categoría.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiBody({
    type: ActualizarCategoryDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          name: 'Impresoras y escáneres',
          description:
            'Problemas relacionados con impresoras, escáneres y dispositivos de impresión.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para actualizar categorías.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarCategoryDto: ActualizarCategoryDto,
  ) {
    return this.categoriesService.update(id, actualizarCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.AGENTE)
  @ApiOperation({
    summary: 'Eliminar una categoría',
    description: 'Permite a un administrador o agente eliminar una categoría.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría a eliminar',
    example: 4,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para eliminar categorías.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
