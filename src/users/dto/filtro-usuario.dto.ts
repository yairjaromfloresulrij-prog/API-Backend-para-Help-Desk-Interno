import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class FiltroUsuarioDto {
  @ApiPropertyOptional({
    description: 'Filtrar usuarios por rol',
    enum: Role,
    example: Role.AGENTE,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: 'El rol debe ser ADMIN, AGENTE o EMPLEADO',
  })
  role?: Role;
}
