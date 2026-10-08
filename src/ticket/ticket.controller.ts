import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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

import type { Request } from 'express';

import { TicketService } from './ticket.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto.js';
import { AssignTicketDto } from './dto/assign-ticket.dto.js';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un ticket',
    description: 'Permite al usuario autenticado crear un nuevo ticket.',
  })
  @ApiBody({
    type: CreateTicketDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de ticket',
        value: {
          title: 'No funciona el mouse',
          description:
            'El mouse de mi computadora dejó de funcionar correctamente.',
          priority: 'MEDIA',
          categoryId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ticket creado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos del ticket inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: Request) {
    const userId = (req.user as { sub: number }).sub;

    return this.ticketService.create(createTicketDto, userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'AGENTE', 'EMPLEADO')
  @ApiOperation({
    summary: 'Listar tickets',
    description:
      'Obtiene los tickets disponibles según el rol del usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tickets obtenida correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para consultar los tickets.',
  })
  findAll(@Req() req: Request) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.ticketService.findAll(user.sub, user.role);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener ticket por ID',
    description: 'Obtiene un ticket específico según el usuario autenticado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ticket',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket encontrado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket no encontrado.',
  })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.ticketService.findOne(+id, user.sub, user.role);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Cambiar estado de un ticket',
    description:
      'Permite a un administrador cambiar el estado de cualquier ticket y a un agente cambiar el estado de los tickets que tiene asignados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ticket',
    example: 1,
  })
  @ApiBody({
    type: UpdateTicketStatusDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de cambio de estado',
        value: {
          status: 'EN_PROCESO',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del ticket actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El cambio de estado no es válido.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para cambiar el estado de este ticket.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket no encontrado.',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.ticketService.updateStatus(
      +id,
      updateTicketStatusDto,
      user.sub,
      user.role,
    );
  }

  @Patch(':id/assign')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Asignar un ticket',
    description: 'Permite al administrador asignar un ticket a un agente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ticket a asignar',
    example: 1,
  })
  @ApiBody({
    type: AssignTicketDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de asignación',
        value: {
          assignedToId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket asignado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo un administrador puede asignar tickets.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket o usuario no encontrado.',
  })
  assign(@Param('id') id: string, @Body() assignTicketDto: AssignTicketDto) {
    return this.ticketService.assign(+id, assignTicketDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un ticket',
    description: 'Elimina un ticket mediante su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ticket a eliminar',
    example: 4,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket eliminado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para eliminar este ticket.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket no encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
