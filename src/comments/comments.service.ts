import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role, NotificationType } from '../generated/prisma/enums.js';
import { NotificationService } from '../notifications/notification.service.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    ticketId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
    userRole: string,
  ) {
    const ticket = await this.prisma.ticket.findFirst({
      where:
        userRole === 'EMPLEADO'
          ? {
              id: ticketId,
              createdById: userId,
            }
          : {
              id: ticketId,
            },
      select: {
        id: true,
        createdById: true,
        assignedToId: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('El ticket no existe');
    }
    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        ticketId: ticket.id,
        userId,
      },
      include: {
        user: {
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
    const usuarioNotificar = new Set<number>();
    if (ticket.createdById !== userId) {
      usuarioNotificar.add(ticket.createdById);
    }
    if (ticket.assignedToId && ticket.assignedToId !== userId) {
      usuarioNotificar.add(ticket.assignedToId);
    }
    // Notificar a los usuarios correspondientes
    for (const destinatarioId of usuarioNotificar) {
      await this.notificationService.enviar(
        destinatarioId,
        `Nuevo comentario en el ticket #${ticket.id}`,
        NotificationType.NUEVO_COMENTARIO,
        ticket.id,
      );
    }
    return comment;
  }

  async findHistorial(ticketId: number, userId: number, role: Role) {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      select: {
        id: true,
        createdById: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('El ticket no existe');
    }

    if (role === Role.EMPLEADO && ticket.createdById !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para ver los comentarios de este ticket',
      );
    }

    return this.prisma.comment.findMany({
      where: {
        ticketId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
          },
        },
      },
    });
  }
  async findAll(ticketId: number, userId: number, userRole: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where:
        userRole === 'EMPLEADO'
          ? {
              id: ticketId,
              createdById: userId,
            }
          : {
              id: ticketId,
            },
    });

    if (!ticket) {
      throw new NotFoundException('El ticket no existe');
    }

    return this.prisma.comment.findMany({
      where: {
        ticketId: ticket.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
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
  }

  async findOne(id: number, userId: number, userRole: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        ticket: {
          select: {
            id: true,
            createdById: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('El comentario no existe');
    }

    if (userRole === 'EMPLEADO' && comment.ticket.createdById !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para ver este comentario',
      );
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user,
    };
  }
}
