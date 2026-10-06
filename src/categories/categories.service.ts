import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActualizarCategoryDto } from './dto/actualizar-category.dto.js';
import { CrearCategoryDto } from './dto/crear-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }
  async create(crearCategoryDto: CrearCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: crearCategoryDto.name,
      },
    });

    if (existingCategory) {
      throw new ConflictException('La categoría ya existe');
    }

    return this.prisma.category.create({
      data: {
        name: crearCategoryDto.name,
        description: crearCategoryDto.description,
      },
    });
  }
  async update(id: number, actualizarCategoryDto: ActualizarCategoryDto) {
    await this.findOne(id);

    if (actualizarCategoryDto.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: {
          name: actualizarCategoryDto.name,
          NOT: {
            id,
          },
        },
      });
      if (existingCategory) {
        throw new ConflictException('La categoría ya existe');
      }
    }
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: actualizarCategoryDto.name,
        description: actualizarCategoryDto.description,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new ConflictException('No se puede eliminar la categoría, ya que tiene tickets asociados');
    }
}
}
