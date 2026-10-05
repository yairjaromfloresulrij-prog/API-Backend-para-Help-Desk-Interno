import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const userExisting = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExisting) {
      throw new ConflictException(
        'Ya existe un usuario registrado con ese correo',
      );
    }

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con el ID ${id}`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
