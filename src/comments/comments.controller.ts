import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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

import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Comentarios')
@ApiBearerAuth()
@Controller('tickets/:ticketId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un comentario',
    description:
      'Permite al usuario autenticado agregar un comentario a un ticket.',
  })
  @ApiParam({
    name: 'ticketId',
    description: 'ID del ticket al que pertenece el comentario',
    example: 1,
  })
  @ApiBody({
    type: CreateCommentDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de comentario',
        value: {
          content:
            'Ya revisé el equipo y encontré el problema. Voy a realizar la corrección.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Comentario creado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos del comentario inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para comentar este ticket.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket no encontrado.',
  })
  create(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.commentsService.create(
      ticketId,
      createCommentDto,
      user.sub,
      user.role,
    );
  }

  @Get('ticket/:ticketId')
  @ApiOperation({
    summary: 'Obtener historial de comentarios',
    description:
      'Obtiene el historial de comentarios de un ticket según los permisos del usuario.',
  })
  @ApiParam({
    name: 'ticketId',
    description: 'ID del ticket',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de comentarios obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para consultar el historial.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket no encontrado.',
  })
  findHistorial(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.commentsService.findHistorial(
      ticketId,
      user.sub,
      user.role as any,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener comentario por ID',
    description: 'Obtiene un comentario específico mediante su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del comentario',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Comentario encontrado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario no encontrado.',
  })
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar comentarios de un ticket',
    description: 'Obtiene todos los comentarios asociados al ticket indicado.',
  })
  @ApiParam({
    name: 'ticketId',
    description: 'ID del ticket',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Comentarios obtenidos correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para consultar los comentarios.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket no encontrado.',
  })
  findAll(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.commentsService.findAll(ticketId, user.sub, user.role);
  }
}
