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
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { TicketService } from './ticket.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { AssignTicketDto } from './dto/assign-ticket.dto.js';

@ApiBearerAuth()
@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as { sub: number }).sub;

    return this.ticketService.create(createTicketDto, userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'AGENTE', 'EMPLEADO')
  findAll(@Req() req: Request) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.ticketService.findAll(user.sub, user.role);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.ticketService.findOne(
      +id,
      user.sub,
      user.role,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request,
  ) {
    const userRole = (req.user as { role: string }).role;

    return this.ticketService.update(
      +id,
      updateTicketDto,
      userRole,
    );
  }

  @Patch(':id/assign')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  assign(
    @Param('id') id: string,
    @Body() assignTicketDto: AssignTicketDto,
  ) {
    return this.ticketService.assign(
      +id,
      assignTicketDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}