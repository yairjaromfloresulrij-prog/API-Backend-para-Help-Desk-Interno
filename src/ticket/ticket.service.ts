import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { Role, NotificationType } from '../generated/prisma/enums.js';
import { AssignTicketDto } from './dto/assign-ticket.dto.js';
import { NotificationService } from '../notifications/notification.service.js';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: createTicketDto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    return this.prisma.ticket.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        priority: createTicketDto.priority,
        status: 'ABIERTO',
        createdById: userId,
        categoryId: createTicketDto.categoryId,
      },
    });
  }

  async findAll(userId: number, userRole: string) {
    return this.prisma.ticket.findMany({
      where: 
       userRole === 'EMPLEADO'
        ? { createdById: userId }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where:
        userRole === 'EMPLEADO'
          ? { id, createdById: userId }
          : { id },
    });

    if (!ticket) {
      throw new NotFoundException('El ticket no existe');
    }
    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto, userRole: string) {
    if (userRole !== 'ADMIN' && userRole !== 'AGENTE') {
      throw new ForbiddenException(
        'Solo ADMIN o AGENTE pueden cambiar el estado del ticket',
      );
    }

    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket) {
      throw new NotFoundException('El ticket no existe');
    }

    if (!updateTicketDto.status) {
      throw new BadRequestException(
        'Debes indicar un estado para actualizar el ticket',
      );
    }

    const transicionesPermitidas: Record<string, string[]> = {
      ABIERTO: ['EN_PROCESO', 'CERRADO'],
      EN_PROCESO: ['RESUELTO', 'CERRADO'],
      RESUELTO: ['CERRADO'],
      CERRADO: [],
    };

    const estadosPermitidos = transicionesPermitidas[ticket.status];

    if (!estadosPermitidos.includes(updateTicketDto.status)) {
      throw new BadRequestException(
        `No se puede cambiar el ticket de ${ticket.status} a ${updateTicketDto.status}`,
      );
    }
    const updatedTicket = await this.prisma.ticket.update({
      where: {
        id,
      },
      data: {
        status: updateTicketDto.status,
      },
    });
    if (updateTicketDto.status === 'RESUELTO') {
      await this.notificationService.enviar(
        ticket.createdById,
        'Tu ticket ha sido resuelto.',
        NotificationType.TICKET_RESUELTO,
        ticket.id
      );
    }
    if (updateTicketDto.status === 'CERRADO') {
      await this.notificationService.enviar(
        ticket.createdById,
        'Tu ticket ha sido cerrado.',
        NotificationType.TICKET_CERRADO,
        ticket.id
      );
    }
    return updatedTicket;
  }

  async remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
async assign(id: number, assignTicketDto: AssignTicketDto) {
  const ticket = await this.prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) {
    throw new NotFoundException('El ticket no existe');
  }

  const agent = await this.prisma.user.findUnique({
    where: {
      id: assignTicketDto.agentId,
    },
  });

  if (!agent || agent.role !== Role.AGENTE) {
    throw new BadRequestException(
      'El agente no existe o no tiene el rol adecuado',
    );
  }

  const updatedTicket = await this.prisma.ticket.update({
    where: { id },
    data: {
      assignedToId: agent.id,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  await this.notificationService.enviar(
    agent.id,
    `El ticket #${ticket.id} "${ticket.title}" ha sido asignado a ti.`,
    NotificationType.TICKET_ASIGNADO,
    ticket.id,
  );

  return updatedTicket;
}
}