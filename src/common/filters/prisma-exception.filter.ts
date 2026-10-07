import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002':
        return response.status(409).json({
          statusCode: 409,
          message: 'El recurso ya existe',
        });

      case 'P2025':
        return response.status(404).json({
          statusCode: 404,
          message: 'Recurso no encontrado',
        });

      case 'P2003':
        return response.status(409).json({
          statusCode: 409,
          message:
            'No se puede realizar la operación por una relación existente',
        });

      default:
        return response.status(500).json({
          statusCode: 500,
          message: 'Error interno del servidor',
        });
    }
  }
}