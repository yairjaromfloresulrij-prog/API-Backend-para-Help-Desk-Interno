import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async crearUsuario(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'Ya existe un usuario registrado con ese correo',
      );
    }

    return this.prisma.usuario.create({
      data: {
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        email: createUsuarioDto.email,
        password: createUsuarioDto.password,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
    });
  }

  async FindAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el ID ${id}`);
    }

    return usuario;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }
}
