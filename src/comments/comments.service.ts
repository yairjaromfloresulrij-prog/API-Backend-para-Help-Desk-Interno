import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

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
    });

    if (!ticket) {
      throw new NotFoundException('El ticket no existe');
    }
    return this.prisma.comment.create({
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
  async findAll (ticketId: number, userId: number, userRole: string) {
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

  async findOne(id: number) {
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
      },
    });
    if (!comment) {
      throw new NotFoundException('El comentario no existe');
    }
    return comment;
  }
}