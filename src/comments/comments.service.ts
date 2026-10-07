import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

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

  async findAll(
    ticketId: number,
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

    return this.prisma.comment.findMany({
      where: {
        ticketId,
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
}