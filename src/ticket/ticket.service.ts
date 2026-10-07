import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
